import { Link } from "react-router";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";

export default function Welcome() {
  const authStore = useAuthStore();
  const uiStore = useUiStore();

  function tryModal() {
    uiStore.addModal({
      title: "This is a modal",
      message: "This is the message",
      showCloseButton: false,
      showCancelButton: false,
      buttons: [
        { name: 'dale', onClick: (close) => { console.log('dale'); close() } },
      ]
    })
  }

  async function tryConfirm() {
    const answer = await uiStore.confirm({
      title: "This is a modal",
      message: "This is the message",
    })
    console.log(answer)
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Master Your Poker Tournaments</h1>
          <p className="py-6">
            From blinds to breaks, we’ve got your poker tournament covered. Welcome to the easiest way to run your games!
          </p>
          {!authStore.isLoggedIn && <>
            <Link to="/sign-in" className="btn btn-secondary">
              Sign In
            </Link>
            <Link to="/sign-up" className="btn btn-secondary">
              Sign Up
            </Link>
          </>}
          <Link to="/setup" className="btn btn-primary">
            Start
            {!authStore.isLoggedIn && <span>
              as guest (limited features)
            </span>}
          </Link>

          <div className="divider"></div>
          <button onClick={tryModal} className='btn'>Try modal</button>
          <button onClick={tryConfirm} className='btn'>Try confirm</button>
        </div>
      </div>
    </div>
  );
}
