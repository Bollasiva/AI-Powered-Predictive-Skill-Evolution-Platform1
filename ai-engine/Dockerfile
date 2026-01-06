# ai-engine/Dockerfile

FROM python:3.9

WORKDIR /app

# 1. Install system build dependencies (gcc, C++ compilers, gfortran for scipy)
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    gfortran \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*
    
COPY requirements.txt .

# 2. Upgrade pip to ensure latest wheel support
RUN pip install --upgrade pip setuptools wheel

# 3. Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 4. Install Spacy Model
RUN python -m spacy download en_core_web_sm

COPY . .

EXPOSE 5001

CMD ["python", "server.py"]