import os
import numpy as np
import PyPDF2
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.preprocessing import MinMaxScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# =========================================================
# PDF TEXT EXTRACTION (ONLY TEXT-RICH PDFs)
# =========================================================
def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "
    return text


def load_resumes_from_folder(folder_path):
    resumes = []
    names = []

    for file in os.listdir(folder_path):
        if file.endswith(".pdf"):
            path = os.path.join(folder_path, file)
            text = extract_text_from_pdf(path)
            if text.strip():  # only text-rich resumes
                resumes.append(text)
                names.append(file)

    return resumes, names


# =========================================================
# 1. PARTIAL CREDIT MODULE (VAGUE SKILLS)
# =========================================================
class PartialCreditScorer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        vague = ["basic", "familiar", "learning", "exposure"]
        strong = ["expert", "advanced", "certified", "professional", "experienced"]

        scores = []
        for text in X:
            t = text.lower()
            score = 0
            for w in vague:
                if w in t:
                    score += 0.3
            for w in strong:
                if w in t:
                    score += 1.0
            scores.append(score)

        return np.array(scores).reshape(-1, 1)


# =========================================================
# 2. KEYWORD REPETITION PENALTY (ANTI-GAMING)
# =========================================================
class KeywordPenalty(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        penalties = []
        for text in X:
            words = text.lower().split()
            if not words:
                penalties.append(0)
                continue
            max_freq = max(words.count(w) for w in set(words))
            penalty = -0.05 * max_freq
            penalties.append(penalty)

        return np.array(penalties).reshape(-1, 1)


# =========================================================
# 3. SKILL–PROJECT CONSISTENCY CHECK
# =========================================================
class SkillProjectConsistency(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        skill_project_pairs = [
            ("python", "project"),
            ("java", "application"),
            ("machine learning", "model"),
            ("data science", "analysis"),
            ("web", "website"),
        ]

        scores = []
        for text in X:
            t = text.lower()
            score = 0
            for skill, proj in skill_project_pairs:
                if skill in t and proj in t:
                    score += 1
            scores.append(score)

        return np.array(scores).reshape(-1, 1)


# =========================================================
# 4. RELATIVE SCORING (CROSS-RESUME COMPARISON)
# =========================================================
class RelativeScorer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.matrix = self.vectorizer.fit_transform(X)
        return self

    def transform(self, X):
        similarity_matrix = cosine_similarity(self.matrix)
        relative_scores = similarity_matrix.mean(axis=1)
        return relative_scores.reshape(-1, 1)


# =========================================================
# 5. DUPLICATE / TEMPLATE DETECTION
# =========================================================
class DuplicateDetector(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.matrix = self.vectorizer.fit_transform(X)
        return self

    def transform(self, X):
        similarity_matrix = cosine_similarity(self.matrix)
        scores = []

        for i in range(len(similarity_matrix)):
            sim_scores = similarity_matrix[i]
            sim_scores = sim_scores[sim_scores < 1]  # exclude self similarity
            max_sim = max(sim_scores) if len(sim_scores) > 0 else 0

            if max_sim > 0.90:
                scores.append(0)  # duplicate detected
            else:
                scores.append(1)

        return np.array(scores).reshape(-1, 1)


# =========================================================
# 6. CONFIGURABLE WEIGHTS
# =========================================================
WEIGHTS = {
    "partial": 0.20,
    "relative": 0.25,
    "penalty": 0.15,
    "consistency": 0.20,
    "duplicate": 0.20,
}


# =========================================================
# 7. FEATURE MERGING PIPELINE
# =========================================================
feature_pipeline = FeatureUnion([
    ("partial_credit", PartialCreditScorer()),
    ("relative_score", RelativeScorer()),
    ("keyword_penalty", KeywordPenalty()),
    ("consistency", SkillProjectConsistency()),
    ("duplicate", DuplicateDetector()),
])


# =========================================================
# 8. FINAL PIPELINE
# =========================================================
resume_pipeline = Pipeline([
    ("features", feature_pipeline),
    ("scaler", MinMaxScaler())
])


# =========================================================
# 9. FINAL SCORE COMPUTATION
# =========================================================
def compute_final_scores(resumes):
    features = resume_pipeline.fit_transform(resumes)

    final_scores = (
        WEIGHTS["partial"] * features[:, 0] +
        WEIGHTS["relative"] * features[:, 1] +
        WEIGHTS["penalty"] * features[:, 2] +
        WEIGHTS["consistency"] * features[:, 3] +
        WEIGHTS["duplicate"] * features[:, 4]
    )

    return final_scores


# =========================================================
# 10. RANKING FUNCTION
# =========================================================
def rank_resumes(resumes, names):
    scores = compute_final_scores(resumes)
    ranked = sorted(zip(names, scores), key=lambda x: x[1], reverse=True)
    return ranked


# =========================================================
# 11. MAIN EXECUTION (PDF DATASET)
# =========================================================
if __name__ == "__main__":
    folder_path = "resumes_dataset"  # put your PDF resumes here

    resumes, names = load_resumes_from_folder(folder_path)

    if not resumes:
        print("No valid text-rich PDF resumes found!")
        exit()

    ranked_results = rank_resumes(resumes, names)

    print("\n===== RESUME RANKING RESULTS =====")
    for name, score in ranked_results:
        print(f"{name} -> Score: {round(score, 4)}")
