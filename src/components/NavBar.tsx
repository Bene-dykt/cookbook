import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function NavBar() {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        Cookbook
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/browse">Browse</NavLink>
        {!loading && (
          <>
            {user ? (
              <>
                <NavLink to="/my-recipes">My Recipes</NavLink>
                <button className="nav-signout" onClick={signOut}>
                  Sign out
                </button>
              </>
            ) : (
              <NavLink to="/login">Sign in</NavLink>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
