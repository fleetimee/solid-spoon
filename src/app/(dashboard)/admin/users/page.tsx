export default function UsersPage() {
  return (
    <main className="flex flex-col grow p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage users and their permissions here.
          </p>
        </div>
      </div>
    </main>
  );
}
