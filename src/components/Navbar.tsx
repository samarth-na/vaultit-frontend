type NavbarProps = {
  user: {
    id: string;
    email: string;
    name?: string;
  };
};

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border  rounded-xl m-2 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Name/Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-serif font-bold text-cyan-600">
              VaultIt
            </h1>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              <span className="font-medium">{user.name || user.email}</span>
            </div>

            {/* Logout Button Placeholder */}
            <button
              onClick={() => {
                // TODO: Implement logout functionality
                console.log("Logout clicked");
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
