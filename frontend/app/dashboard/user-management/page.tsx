"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  UserPlus,
  Pencil,
  Trash2,
  Lock,
  Mail,
  User as UserIcon,
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

type User = {
  id: number;
  name?: string;
  email: string;
  role: string;
};

const ROLES = [
  { value: "BUYER", label: "Buyer" },
  { value: "REAL_ESTATE_AGENT", label: "Real Estate Agent" },
  { value: "LEGAL_REVIEWER", label: "Legal Reviewer" },
  { value: "FINANCIAL_INSTITUTION", label: "Financial Institution" },
  { value: "ADMINISTRATOR", label: "Administrator" },
];

export default function UserManagementPage() {
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState("BUYER");
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("BUYER");
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Delete User Confirmation State
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Check admin role
  useEffect(() => {
    const savedRole = localStorage.getItem("estateintel_user_role")?.toUpperCase();
    setCurrentUserRole(savedRole || null);
    setAuthChecked(true);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("estateintel_jwt_token");

      const response = await fetch(`${API}/api/admin/users`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 403 || response.status === 401) {
        throw new Error("Access Denied: You do not have administrator permissions to view users.");
      }

      if (!response.ok) {
        throw new Error(`Unable to load users (${response.status}). Please check permissions.`);
      }

      const data = await response.json();
      const list: User[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

      setUsers(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while loading users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authChecked && currentUserRole === "ADMINISTRATOR") {
      void loadUsers();
    }
  }, [authChecked, currentUserRole, loadUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setActionLoading(true);

    try {
      const token = localStorage.getItem("estateintel_jwt_token");
      const response = await fetch(`${API}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: addName.trim(),
          email: addEmail.trim(),
          password: addPassword,
          role: addRole,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create user.");
      }

      setIsAddModalOpen(false);
      setAddName("");
      setAddEmail("");
      setAddPassword("");
      setAddRole("BUYER");
      setSuccessMessage("User created successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
      void loadUsers();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Error creating user");
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditRole(user.role || "BUYER");
    setEditPassword("");
    setModalError("");
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setModalError("");
    setActionLoading(true);

    try {
      const token = localStorage.getItem("estateintel_jwt_token");
      const payload: { name: string; email: string; role: string; password?: string } = {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const response = await fetch(`${API}/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update user.");
      }

      setEditingUser(null);
      setSuccessMessage("User updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
      void loadUsers();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Error updating user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setActionLoading(true);

    try {
      const token = localStorage.getItem("estateintel_jwt_token");
      const response = await fetch(`${API}/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete user.");
      }

      setDeletingUser(null);
      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
      void loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting user");
      setDeletingUser(null);
    } finally {
      setActionLoading(false);
    }
  };

  // If role check finished and user is NOT an admin, display access denied
  if (authChecked && currentUserRole !== "ADMINISTRATOR") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900">
        <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-md">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <ShieldAlert size={36} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Access Restricted
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            User Management is strictly confidential and reserved for System Administrators.
            Your current role is{" "}
            <span className="font-semibold text-blue-600">
              {currentUserRole ? currentUserRole.replaceAll("_", " ") : "Unassigned"}
            </span>.
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
          >
            <ArrowLeft size={16} />
            Return to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();
    return (
      (user.name || "").toLowerCase().includes(query) ||
      (user.email || "").toLowerCase().includes(query) ||
      (user.role || "").toLowerCase().includes(query) ||
      String(user.id).includes(query)
    );
  });

  const adminCount = users.filter((u) => u.role === "ADMINISTRATOR").length;
  const buyerCount = users.filter((u) => u.role === "BUYER").length;
  const agentCount = users.filter((u) => u.role === "REAL_ESTATE_AGENT").length;

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <header className="mb-8 mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Admin Control Center
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              User Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Add new team members, edit user roles, or remove accounts securely.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void loadUsers()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60 shadow-sm"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(true);
                setModalError("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
            >
              <UserPlus size={17} />
              Add User
            </button>
          </div>
        </header>

        {/* Alerts */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800 shadow-sm">
            <CheckCircle2 size={19} className="text-green-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 shadow-sm">
            <AlertTriangle size={19} className="text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Row */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total Users"
            value={loading ? "—" : users.length}
            icon={<Users size={20} />}
            badgeColor="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Administrators"
            value={loading ? "—" : adminCount}
            icon={<ShieldCheck size={20} />}
            badgeColor="bg-purple-50 text-purple-600"
          />
          <StatCard
            label="Buyers"
            value={loading ? "—" : buyerCount}
            icon={<Users size={20} />}
            badgeColor="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="Real Estate Agents"
            value={loading ? "—" : agentCount}
            icon={<Users size={20} />}
            badgeColor="bg-amber-50 text-amber-600"
          />
        </section>

        {/* Users Table Card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">Registered Accounts</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage roles and access permissions across the system.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, or role..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-blue-600" />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={36} className="mx-auto mb-3 text-slate-300" />
              <h3 className="font-semibold text-slate-800">
                {users.length === 0 ? "No users registered yet" : "No matching users"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {users.length === 0
                  ? "Click 'Add User' to register your first team member."
                  : "Try modifying your search query."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">Role</th>
                    <th className="px-5 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700 text-xs">
                            {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {user.name || "User"}
                            </div>
                            <div className="text-xs text-slate-400">ID: #{user.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {user.email}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === "ADMINISTRATOR"
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "REAL_ESTATE_AGENT"
                              ? "bg-blue-100 text-blue-700"
                              : user.role === "LEGAL_REVIEWER"
                              ? "bg-amber-100 text-amber-700"
                              : user.role === "FINANCIAL_INSTITUTION"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {user.role ? user.role.replaceAll("_", " ") : "BUYER"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                          >
                            <Pencil size={13} className="text-slate-500" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingUser(user)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          )}
        </section>

        {/* ADD USER MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <UserPlus size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Add New User</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              {modalError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-blue-500">
                    <UserIcon size={16} className="text-slate-400" />
                    <input
                      type="text"
                      required
                      value={addName}
                      onChange={(e) => setAddName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-blue-500">
                    <Mail size={16} className="text-slate-400" />
                    <input
                      type="email"
                      required
                      value={addEmail}
                      onChange={(e) => setAddEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Role
                  </label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Password (min. 6 characters)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-blue-500">
                    <Lock size={16} className="text-slate-400" />
                    <input
                      type={showAddPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={addPassword}
                      onChange={(e) => setAddPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddPassword(!showAddPassword)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {showAddPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60"
                  >
                    {actionLoading ? "Saving..." : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT USER MODAL */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Pencil size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Edit User</h3>
                    <p className="text-xs text-slate-500">Editing User #{editingUser.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              {modalError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {modalError}
                </div>
              )}

              <form onSubmit={handleUpdateUser} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-blue-500">
                    <UserIcon size={16} className="text-slate-400" />
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-blue-500">
                    <Mail size={16} className="text-slate-400" />
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    New Password (optional)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-blue-500">
                    <Lock size={16} className="text-slate-400" />
                    <input
                      type={showEditPassword ? "text" : "password"}
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Leave blank to keep unchanged"
                      className="w-full text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {showEditPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60"
                  >
                    {actionLoading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 size={28} />
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-slate-900">Delete User Account</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Are you sure you want to delete user{" "}
                  <span className="font-semibold text-slate-900">{deletingUser.email}</span>?
                  This action cannot be undone.
                </p>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  disabled={actionLoading}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 hover:bg-red-700 disabled:opacity-60"
                >
                  {actionLoading ? "Deleting..." : "Yes, Delete User"}
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
          EstateIntel · Administrator User Management
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
  badgeColor,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  badgeColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <span className={`rounded-xl p-2.5 ${badgeColor}`}>{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
