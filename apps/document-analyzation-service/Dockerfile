FROM python:3.10-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1

ENV WORKING_DIRECTORY="/document-analyzation-service"
WORKDIR "$WORKING_DIRECTORY"

COPY requirements_locked ./requirements_locked
ENV VIRTUAL_ENV="$WORKING_DIRECTORY/venv"
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV PYTHONPATH="/document-analyzation-service"
ENV REQUIREMENTS_FILE="$WORKING_DIRECTORY/requirements_locked/requirements-lock-uv-py310-all.txt"
RUN python -m venv "$VIRTUAL_ENV" && pip install --no-cache-dir -r "$REQUIREMENTS_FILE"
COPY . .
#CMD ["tail", "-f", "/dev/null"] # keeps the container running

CMD ["python", "-u", "document_analyzation_service/main.py"]