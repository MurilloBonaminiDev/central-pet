"""Seed catalog services for the demo tenant (run after seed_auth)."""

from __future__ import annotations

import uuid

from sqlalchemy import select

from app.infrastructure.database.models import ServiceModel, TenantModel
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.repositories.service_repository import slugify

DEMO_SERVICES = [
    {
        "name": "Consulta veterinária",
        "description": (
            "Avaliação clínica completa com anamnese, exame físico e orientação "
            "personalizada para o seu pet."
        ),
        "image_url": "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Veterinário examinando um cão em consulta",
        "price_cents": 18000,
        "duration_minutes": 45,
        "sort_order": 1,
    },
    {
        "name": "Castração",
        "description": (
            "Procedimento eletivo com equipe experiente, monitoramento anestésico "
            "e orientação pós-operatória."
        ),
        "image_url": "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Ambiente clínico veterinário preparado para cirurgia",
        "price_cents": None,
        "duration_minutes": 120,
        "sort_order": 2,
    },
    {
        "name": "Vacinação",
        "description": (
            "Protocolos de imunização atualizados, registro no prontuário e "
            "lembretes de reforço."
        ),
        "image_url": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Aplicação de vacina em pet",
        "price_cents": 9500,
        "duration_minutes": 20,
        "sort_order": 3,
    },
    {
        "name": "Banho e Tosa",
        "description": (
            "Higiene profunda e tosa conforme a raça, com produtos pet-friendly "
            "e acabamento profissional."
        ),
        "image_url": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Cão após banho e tosa profissional",
        "price_cents": 9000,
        "duration_minutes": 90,
        "sort_order": 4,
    },
    {
        "name": "Exames",
        "description": (
            "Laboratório e imagem com laudos rápidos para diagnóstico seguro "
            "e tratamento adequado."
        ),
        "image_url": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Equipamentos de exames veterinários",
        "price_cents": 15000,
        "duration_minutes": 30,
        "sort_order": 5,
    },
    {
        "name": "Cirurgias",
        "description": (
            "Procedimentos eletivos e corretivos em centro cirúrgico equipado, "
            "com acompanhamento pós-operatório."
        ),
        "image_url": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Equipe veterinária em procedimento cirúrgico",
        "price_cents": None,
        "duration_minutes": 180,
        "sort_order": 6,
    },
    {
        "name": "Outros serviços",
        "description": (
            "Internação, hotel pet, táxi pet, odontologia e demais serviços "
            "sob consulta com nossa equipe."
        ),
        "image_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Pet confortável recebendo cuidados na clínica",
        "price_cents": None,
        "duration_minutes": 60,
        "sort_order": 7,
    },
]


def seed() -> None:
    db = SessionLocal()
    try:
        tenant = db.scalar(select(TenantModel).where(TenantModel.slug == "clinica-demo"))
        if tenant is None:
            print("Services seed skipped: run seed_auth first (tenant clinica-demo not found)")
            return

        created = 0
        for item in DEMO_SERVICES:
            slug = slugify(item["name"])
            existing = db.scalar(
                select(ServiceModel).where(
                    ServiceModel.tenant_id == tenant.id,
                    ServiceModel.slug == slug,
                    ServiceModel.deleted_at.is_(None),
                )
            )
            if existing is not None:
                continue

            db.add(
                ServiceModel(
                    id=uuid.uuid4(),
                    tenant_id=tenant.id,
                    slug=slug,
                    name=item["name"],
                    description=item["description"],
                    image_url=item["image_url"],
                    image_alt=item["image_alt"],
                    price_cents=item["price_cents"],
                    duration_minutes=item["duration_minutes"],
                    sort_order=item["sort_order"],
                    is_active=True,
                )
            )
            created += 1

        db.commit()
        print(f"Services seed OK ({created} new service(s))")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
