"""Seed catalog products for the demo tenant (run after seed_auth)."""

from __future__ import annotations

import uuid

from sqlalchemy import select

from app.infrastructure.database.models import ProductModel, TenantModel
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.repositories.product_repository import slugify

DEMO_PRODUCTS = [
    {
        "name": "Ração Premium Cães Adultos 15kg",
        "description": "Fórmula completa com ômega 3 e 6 para pelagem saudável e energia diária.",
        "category": "Rações",
        "image_url": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Saco de ração para cães",
        "price_cents": 28990,
        "sort_order": 1,
    },
    {
        "name": "Ração Gatos Castrados 3kg",
        "description": "Controle de peso e suporte urinário, ideal para felinos castrados.",
        "category": "Rações",
        "image_url": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Gato perto de tigela de ração",
        "price_cents": 11990,
        "sort_order": 2,
    },
    {
        "name": "Antipulgas Spot-On (pipeta)",
        "description": "Proteção mensal contra pulgas e carrapatos para cães de 10 a 25 kg.",
        "category": "Medicamentos",
        "image_url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Medicamento veterinário",
        "price_cents": 8990,
        "sort_order": 3,
    },
    {
        "name": "Vermífugo Comprimido",
        "description": "Tratamento amplo contra vermes intestinais, com dosagem por peso.",
        "category": "Medicamentos",
        "image_url": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Comprimidos veterinários",
        "price_cents": 4250,
        "sort_order": 4,
    },
    {
        "name": "Bola Interativa com Som",
        "description": "Estimula o brincar e o movimento, ideal para cães médios e grandes.",
        "category": "Brinquedos",
        "image_url": "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Cão brincando ao ar livre",
        "price_cents": 3490,
        "sort_order": 5,
    },
    {
        "name": "Arranhador Vertical Compacto",
        "description": "Base estável e sisal resistente para gatos adultos e filhotes.",
        "category": "Brinquedos",
        "image_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Gato em ambiente doméstico",
        "price_cents": 14990,
        "sort_order": 6,
    },
    {
        "name": "Coleira Ajustável Nylon",
        "description": "Resistente, com fivela segura e acabamento confortável no pescoço.",
        "category": "Acessórios",
        "image_url": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Cão com coleira",
        "price_cents": 4990,
        "sort_order": 7,
    },
    {
        "name": "Cama Ortopédica Média",
        "description": "Espuma de alta densidade para articulações e sono reparador.",
        "category": "Acessórios",
        "image_url": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Cães descansando",
        "price_cents": 19990,
        "sort_order": 8,
    },
    {
        "name": "Shampoo Neutro Hipoalergênico",
        "description": "Limpeza suave para peles sensíveis, sem fragrância agressiva.",
        "category": "Higiene",
        "image_url": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Produtos de higiene pet",
        "price_cents": 5490,
        "sort_order": 9,
    },
    {
        "name": "Areia Sanitária Premium 4kg",
        "description": "Alta absorção, controle de odores e fácil de limpar.",
        "category": "Higiene",
        "image_url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80",
        "image_alt": "Gato em ambiente limpo",
        "price_cents": 3990,
        "sort_order": 10,
    },
]


def seed() -> None:
    db = SessionLocal()
    try:
        tenant = db.scalar(select(TenantModel).where(TenantModel.slug == "clinica-demo"))
        if tenant is None:
            print("Products seed skipped: run seed_auth first (tenant clinica-demo not found)")
            return

        created = 0
        for item in DEMO_PRODUCTS:
            slug = slugify(item["name"])
            existing = db.scalar(
                select(ProductModel).where(
                    ProductModel.tenant_id == tenant.id,
                    ProductModel.slug == slug,
                    ProductModel.deleted_at.is_(None),
                )
            )
            if existing is not None:
                continue

            db.add(
                ProductModel(
                    id=uuid.uuid4(),
                    tenant_id=tenant.id,
                    slug=slug,
                    name=item["name"],
                    description=item["description"],
                    category=item["category"],
                    image_url=item["image_url"],
                    image_alt=item["image_alt"],
                    price_cents=item["price_cents"],
                    sort_order=item["sort_order"],
                    is_active=True,
                )
            )
            created += 1

        db.commit()
        print(f"Products seed OK ({created} new product(s))")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
