import { Menu, User, X, Car, MessageCircle, Shield, FileText, Wrench } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center group">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white px-6 py-2.5 font-bold text-2xl tracking-tight rounded-xl shadow-md group-hover:shadow-lg transition-all transform group-hover:scale-105">
                ijar.ps
              </div>
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <a href="/host-dashboard" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors flex items-center gap-2">
              <Car className="w-4 h-4" />
              أجّر سيارتك
            </a>
            <a href="/about" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
              من نحن
            </a>
            <a href="/support" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
              الدعم
            </a>
          </div>

          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <a
                  href="/login"
                  className="hidden sm:block px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  تسجيل الدخول
                </a>
                <a
                  href="/signup"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  إنشاء حساب
                </a>
              </>
            ) : (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {profile?.full_name?.[0] || 'U'}
                </div>
                {menuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {menuOpen && user && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="mb-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {profile?.full_name || 'مستخدم'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">إدارة الحساب</h3>
                <div className="space-y-1">
                  <a
                    href="/host-dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                  >
                    <Car className="w-5 h-5" />
                    لوحة التحكم
                  </a>
                  <a
                    href="/add-car"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                  >
                    <Car className="w-5 h-5" />
                    أضف سيارة
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">المساعدة والدعم</h3>
                <div className="space-y-1">
                  <a
                    href="/support"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    الدعم الفني
                  </a>
                  <a
                    href="/insurance"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    التأمين
                  </a>
                  <a
                    href="/legal"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    الشروط القانونية
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">أدوات المؤجرين</h3>
                <div className="space-y-1">
                  <a
                    href="/host-tools"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-900 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                  >
                    <Wrench className="w-5 h-5" />
                    أدوات المؤجرين
                  </a>
                </div>

                <button
                  onClick={() => signOut()}
                  className="w-full mt-4 px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
