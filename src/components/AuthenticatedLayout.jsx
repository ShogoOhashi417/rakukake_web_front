import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// ドロップダウンコンポーネント
const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  
  // 外側クリックで閉じる
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  return (
    <div className="relative" ref={dropdownRef}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

Dropdown.Trigger = ({ children, isOpen, setIsOpen }) => {
  return (
    <div 
      onClick={() => setIsOpen(!isOpen)} 
      className="cursor-pointer"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsOpen(!isOpen);
          e.preventDefault();
        }
      }}
    >
      {children}
    </div>
  );
};

Dropdown.Content = ({ children, isOpen, setIsOpen }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      {React.Children.map(children, child => 
        React.cloneElement(child, { setIsOpen })
      )}
    </div>
  );
};

Dropdown.Link = ({ href, children, active, setIsOpen }) => {
  return (
    <Link
      to={href}
      className={`block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out ${
        active ? "bg-gray-100" : ""
      }`}
      onClick={() => setIsOpen && setIsOpen(false)}
    >
      {children}
    </Link>
  );
};

// ナビゲーションリンクコンポーネント
const NavLink = ({ to, children, active }) => {
  return (
    <Link
      to={to}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
        active
          ? "border-indigo-400 text-gray-900 focus:outline-none focus:border-indigo-700"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300"
      }`}
    >
      {children}
    </Link>
  );
};

// レスポンシブナビゲーションリンク
const ResponsiveNavLink = ({ to, children, active }) => {
  return (
    <Link
      to={to}
      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
        active
          ? "border-indigo-400 text-indigo-700 bg-indigo-50 focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700"
          : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300"
      }`}
    >
      {children}
    </Link>
  );
};

// ロゴコンポーネント
const ApplicationLogo = ({ className }) => {
  return (
    <div className={className}>
      <span className="text-xl font-bold text-indigo-600">らくかけ</span>
    </div>
  );
};

export default function AuthenticatedLayout({ user = { name: 'ユーザー', email: 'user@example.com' }, header, children }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  const location = useLocation();
  
  // 現在のパスがアクティブかどうかを判断する関数
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // パスが特定のプレフィックスで始まるかどうかを判断する関数
  const isActivePrefix = (prefix) => {
    return location.pathname.startsWith(prefix);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="shrink-0 flex items-center">
                <Link to="/">
                  <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                </Link>
              </div>

              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <div className="ml-3 relative">
                  <Dropdown>
                    <Dropdown.Trigger>
                      <span className="inline-flex rounded-md">
                        <button
                          type="button"
                          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium leading-4 rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150 ${
                            isActivePrefix("/report") ? "border-b-2 border-indigo-400 text-gray-900" : ""
                          }`}
                        >
                          レポート
                          <svg
                            className="ml-2 -mr-0.5 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                      <Dropdown.Link href="/report/saving" active={isActive("/report/saving")}>
                        貯金額
                      </Dropdown.Link>
                      <Dropdown.Link href="/report/expense" active={isActive("/report/expense")}>
                        支出額
                      </Dropdown.Link>
                    </Dropdown.Content>
                  </Dropdown>
                </div>
              </div>

              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <div className="ml-3 relative">
                  <Dropdown>
                    <Dropdown.Trigger>
                      <span className="inline-flex rounded-md">
                        <button
                          type="button"
                          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium leading-4 rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150 ${
                            isActivePrefix("/income") ? "border-b-2 border-indigo-400 text-gray-900" : ""
                          }`}
                        >
                          収入管理
                          <svg
                            className="ml-2 -mr-0.5 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                      <Dropdown.Link href="/income" active={isActive("/income")}>
                        収入管理
                      </Dropdown.Link>
                      <Dropdown.Link href="/income/fixed" active={isActive("/income/fixed")}>
                        固定収入
                      </Dropdown.Link>
                    </Dropdown.Content>
                  </Dropdown>
                </div>
              </div>

              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <div className="ml-3 relative">
                  <Dropdown>
                    <Dropdown.Trigger>
                      <span className="inline-flex rounded-md">
                        <button
                          type="button"
                          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium leading-4 rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150 ${
                            isActivePrefix("/expenditure") ? "border-b-2 border-indigo-400 text-gray-900" : ""
                          }`}
                        >
                          支出管理
                          <svg
                            className="ml-2 -mr-0.5 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                      <Dropdown.Link href="/expense" active={isActive("/expense")}>
                        支出管理
                      </Dropdown.Link>
                      <Dropdown.Link href="/expense/fixed" active={isActive("/expense/fixed")}>
                        固定支出
                      </Dropdown.Link>
                    </Dropdown.Content>
                  </Dropdown>
                </div>
              </div>

              <div className="hidden space-x-8 sm:ml-10 sm:flex items-center">
                <NavLink to="/category" active={isActive("/category")}>
                  カテゴリー
                </NavLink>
              </div>

              <div className="hidden space-x-8 sm:ml-10 sm:flex items-center">
                <NavLink to="/bulk-operation" active={isActive("/bulk-operation")}>
                  CSV一括登録
                </NavLink>
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <div className="ml-3 relative">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                      >
                        {user.name}

                        <svg
                          className="ml-2 -mr-0.5 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  </Dropdown.Trigger>

                  <Dropdown.Content>
                    <Dropdown.Link href="/profile" active={isActive("/profile")}>
                      プロフィール
                    </Dropdown.Link>
                    <Dropdown.Link href="/logout">
                      ログアウト
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>

            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    className={!showingNavigationDropdown ? "inline-flex" : "hidden"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={showingNavigationDropdown ? "inline-flex" : "hidden"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={`${showingNavigationDropdown ? "block" : "hidden"} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink to="/income" active={isActive("/income")}>
              収入管理
            </ResponsiveNavLink>
            <ResponsiveNavLink to="/income/fixed" active={isActive("/income/fixed")}>
              固定収入
            </ResponsiveNavLink>
            <ResponsiveNavLink to="/expenditure" active={isActive("/expenditure")}>
              支出管理
            </ResponsiveNavLink>
            <ResponsiveNavLink to="/expenditure/fixed" active={isActive("/expenditure/fixed")}>
              固定支出
            </ResponsiveNavLink>
            <ResponsiveNavLink to="/category" active={isActive("/category")}>
              カテゴリー
            </ResponsiveNavLink>
            <ResponsiveNavLink to="/bulk-operation" active={isActive("/bulk-operation")}>
              CSV一括登録
            </ResponsiveNavLink>
          </div>

          <div className="pt-4 pb-1 border-t border-gray-200">
            <div className="px-4">
              <div className="font-medium text-base text-gray-800">{user.name}</div>
              <div className="font-medium text-sm text-gray-500">{user.email}</div>
            </div>

            <div className="mt-3 space-y-1">
              <ResponsiveNavLink to="/profile">プロフィール</ResponsiveNavLink>
              <ResponsiveNavLink to="/logout">ログアウト</ResponsiveNavLink>
            </div>
          </div>
        </div>
      </nav>

      {header && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
} 