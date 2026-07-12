"""Domain role definitions for tenant memberships."""

from enum import StrEnum


class TenantRole(StrEnum):
    ADMINISTRATOR = "administrator"
    VETERINARIAN = "veterinarian"
    RECEPTION = "reception"
    FINANCIAL = "financial"
    GROOMING = "grooming"  # Banho e Tosa


ROLE_LABELS_PT: dict[TenantRole, str] = {
    TenantRole.ADMINISTRATOR: "Administrador",
    TenantRole.VETERINARIAN: "Veterinário",
    TenantRole.RECEPTION: "Recepção",
    TenantRole.FINANCIAL: "Financeiro",
    TenantRole.GROOMING: "Banho e Tosa",
}
