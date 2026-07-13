from __future__ import annotations

from datetime import date

from pydantic import BaseModel, Field


class CreateFinanceTransactionRequest(BaseModel):
    type: str = Field(min_length=1, max_length=20)
    category: str = Field(min_length=1, max_length=40)
    description: str = Field(min_length=1, max_length=255)
    amount_cents: int = Field(gt=0)
    occurred_on: date


class UpdateFinanceTransactionRequest(BaseModel):
    type: str | None = Field(default=None, min_length=1, max_length=20)
    category: str | None = Field(default=None, min_length=1, max_length=40)
    description: str | None = Field(default=None, min_length=1, max_length=255)
    amount_cents: int | None = Field(default=None, gt=0)
    occurred_on: date | None = None
