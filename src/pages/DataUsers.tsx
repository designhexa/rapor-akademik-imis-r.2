import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { MOCK_USERS } from "@/lib/mock-data";

const roleOptions = ["Semua Role", "Admin", "Koordinator", "Asatidz", "WaliSantri", "Yayasan"];

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-slate-100 text-slate-700 hover:bg-slate-200";
    case "Koordinator":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200";
    case "Asatidz":
      return "bg-primary/10 text-primary hover:bg-primary/20";
    case "WaliSantri":
      return "bg-amber-100 text-amber-700 hover:bg-amber-200";
    case "Yayasan":
      return "bg-purple-100 text-purple-700 hover:bg-purple-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function DataUsers() {
  const [filterRole, setFilterRole] = useState("Semua Role");

  const filteredUsers = MOCK_USERS.filter((user) => {
    return filterRole === "Semua Role" || user.role === filterRole;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Akun Pengguna</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah User
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">No</TableHead>
                <TableHead className="text-muted-foreground">Nama Lengkap</TableHead>
                <TableHead className="text-muted-foreground">Username</TableHead>
                <TableHead className="text-muted-foreground">Role</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">No. HP</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{user.nama}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-primary">{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
