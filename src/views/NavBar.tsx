import { RefObject } from "react";
import * as reactUse from "react-use";
import { Link } from "react-router";
import { Maximize, Minimize, Menu } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useGameStore } from "@/store/game-store";
import LangSelect from "./LangSelect";

function NavBarMenu() {
  const authStore = useAuthStore()
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        <Menu />
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <LangSelect />
        </li>
        <div className="divider my-2" />
        {!authStore.isLoggedIn && (
          <>
            <li>
              <Link to='/sign-in'>Sign In</Link>
            </li>
            <li>
              <Link to='/sign-up'>Sign Up</Link>
            </li>
          </>
        )}
        {authStore.isLoggedIn && (
          <li>
            <a onClick={authStore.signOut}>
              Sign out
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}

export function NavBar({ clockAppRef }: { clockAppRef: RefObject<HTMLDivElement> }) {
  const gameStore = useGameStore();
  const { useFullscreen, useToggle } = reactUse;
  const [showFullscreen, toggleFullscreen] = useToggle(false);
  const isFullscreen = useFullscreen(clockAppRef, showFullscreen, {
    onClose: () => toggleFullscreen(false),
  });

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <NavBarMenu />
      </div>

      <div className="navbar-center">
        {gameStore.connecting && <div className="status status-warning"></div>}
        {gameStore.sharing && <div className="status status-info"></div>}
        <Link to='/' className="btn btn-ghost text-xl">The Poker Clock</Link>
      </div>

      <div className="navbar-end">
        <button
          className="btn btn-ghost"
          onClick={() => toggleFullscreen()}
        >
          {isFullscreen ? <Minimize /> : <Maximize />}
        </button>
      </div>

    </div>
  )
}

