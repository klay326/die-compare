#!/bin/bash
set -e
pip install --upgrade pip
pip install --only-binary :all: -r backend/requirements.txt || pip install -r backend/requirements.txt
