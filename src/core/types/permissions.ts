type Permission = 'read' | 'create' | 'update' | 'delete'

type PermissionEntity = 'manuscript'

type PermissionsRecord = Record<PermissionEntity, Permission[]>

export type { PermissionsRecord }
