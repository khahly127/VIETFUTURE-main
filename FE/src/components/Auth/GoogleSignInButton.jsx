import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import axiosClient from "../../api/axiosClient";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({
  mode = "login",
  role,
  disabled = false,
  onSuccess,
  onError
}) {
  const googleButtonRef = useRef(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      googleButtonRef.current.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response?.credential) {
            onErrorRef.current?.(new Error("Không nhận được credential từ Google"));
            return;
          }

          setLoading(true);
          try {
            const payload = {
              credential: response.credential
            };

            if (role) {
              payload.role = role;
            }

            const result = await axiosClient.post("/auth/google", payload);
            onSuccessRef.current?.(result);
          } catch (error) {
            onErrorRef.current?.(error);
          } finally {
            setLoading(false);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: mode === "register" ? "signup_with" : "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
        locale: "vi",
        width: googleButtonRef.current.offsetWidth || 360
      });

      setSdkReady(true);
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const timer = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(timer);
        initializeGoogle();
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [mode, role]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
        Chưa cấu hình <code>REACT_APP_GOOGLE_CLIENT_ID</code> trong file <code>FE/.env</code>.
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[44px]">
      <div
        className={`flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-700 bg-[#0a101f] py-2.5 text-sm font-medium transition-all ${
          disabled || loading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-[#00e5ff]" />
            <span>Đang xác thực với Google...</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.66 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.6z"
              />
              <path
                fill="#FBBC05"
                d="M5.24 14.51c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.39 6.9C.5 8.71 0 10.74 0 12s.5 3.29 1.39 5.1l3.85-2.59z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.92 1.09-3.34 0-5.86-1.81-6.76-4.51L.7 16.39C2.69 20.29 6.67 23 12 23z"
              />
            </svg>
            <span>{mode === "register" ? "Đăng ký với Google" : "Đăng nhập với Google"}</span>
          </>
        )}
      </div>

      <div
        ref={googleButtonRef}
        className={`absolute inset-0 overflow-hidden opacity-0 ${
          disabled || loading ? "pointer-events-none" : "cursor-pointer"
        } ${sdkReady ? "" : "invisible"}`}
        aria-label={mode === "register" ? "Đăng ký với Google" : "Đăng nhập với Google"}
      />
    </div>
  );
}
