"use client"

import { useFinanceStore } from "@/lib/store"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ShieldIcon, EyeIcon } from "lucide-react"
import type { Role } from "@/lib/types"

export function RoleSwitcher() {
  const role = useFinanceStore((s) => s.role)
  const setRole = useFinanceStore((s) => s.setRole)

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="gap-1 text-xs">
        {role === "admin" ? (
          <ShieldIcon className="size-3" />
        ) : (
          <EyeIcon className="size-3" />
        )}
        {role === "admin" ? "Admin" : "Viewer"}
      </Badge>
      <Select value={role} onValueChange={(v) => setRole(v as Role)}>
        <SelectTrigger className="h-8 w-[110px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
