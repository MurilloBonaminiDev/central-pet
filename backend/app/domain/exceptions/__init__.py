"""Domain exceptions for authentication and authorization."""


class DomainError(Exception):
    """Base domain error."""

    def __init__(self, message: str = "Domain error") -> None:
        self.message = message
        super().__init__(message)


class AuthenticationError(DomainError):
    def __init__(self, message: str = "Credenciais inválidas") -> None:
        super().__init__(message)


class AuthorizationError(DomainError):
    def __init__(self, message: str = "Acesso não autorizado") -> None:
        super().__init__(message)


class TenantAccessError(DomainError):
    def __init__(self, message: str = "Empresa não autorizada para este usuário") -> None:
        super().__init__(message)


class TokenError(DomainError):
    def __init__(self, message: str = "Token inválido ou expirado") -> None:
        super().__init__(message)


class PasswordResetError(DomainError):
    def __init__(self, message: str = "Solicitação de redefinição inválida") -> None:
        super().__init__(message)


class ConflictError(DomainError):
    def __init__(self, message: str = "Recurso já existe") -> None:
        super().__init__(message)


class ValidationError(DomainError):
    def __init__(self, message: str = "Dados inválidos") -> None:
        super().__init__(message)


class NotFoundError(DomainError):
    def __init__(self, message: str = "Recurso não encontrado") -> None:
        super().__init__(message)
