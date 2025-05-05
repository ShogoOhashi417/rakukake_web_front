import React, { useState } from "react";
import { Link } from "react-router-dom";

// 簡易版のドロップダウンメニュー
const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  // 外部クリックを検知してドロップダウンを閉じる
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ドロップダウンを閉じる関数
  const closeDropdown = () => setIsOpen(false);

  // childrenから各要素を探す
  const trigger = React.Children.toArray(children).find(
    (child) => child.type === Dropdown.Trigger
  );
  
  const content = React.Children.toArray(children).find(
    (child) => child.type === Dropdown.Content
  );

  // contentにcloseDropdown関数を渡す
  const contentWithProps = content 
    ? React.cloneElement(content, { closeDropdown }) 
    : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && contentWithProps && (
        <div className="absolute z-[100] mt-2 w-48 rounded-md shadow-lg py-1 bg-white">
          {contentWithProps}
        </div>
      )}
    </div>
  );
};

Dropdown.Trigger = ({ children }) => children;
Dropdown.Content = ({ children, closeDropdown }) => {
  // 子要素をクローンして、closeDropdown関数を渡す
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Dropdown.Link) {
      return React.cloneElement(child, { onClick: closeDropdown });
    }
    return child;
  });
  
  return <div className="py-1">{childrenWithProps}</div>;
};

Dropdown.Link = ({ href, children, active, onClick }) => (
  <Link
    to={href}
    className={`block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out ${
      active ? "bg-gray-100" : ""
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

// ナビゲーションリンク
const NavLink = ({ href, active, children }) => (
  <Link
    to={href}
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out ${
      active
        ? "border-indigo-400 text-gray-900 focus:border-indigo-700"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300"
    }`}
  >
    {children}
  </Link>
);

// レスポンシブナビゲーションリンク
const ResponsiveNavLink = ({ href, active, children }) => (
  <Link
    to={href}
    className={`block w-full pl-3 pr-4 py-2 border-l-4 text-left text-base font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
      active
        ? "border-indigo-400 text-indigo-700 bg-indigo-50 focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700"
        : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
    }`}
  >
    {children}
  </Link>
);

export default function AuthenticatedLayout({ user, header, children }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  // URLパスに基づいてアクティブ状態を判定するヘルパー関数
  const isActive = (path) => window.location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="shrink-0 flex items-center">
                <Link to="/">
                  <span className="text-xl font-bold text-green-800">楽家計</span>
                </Link>
              </div>

              <div className="hidden space-x-8 sm:ms-10 sm:flex items-center">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className={`inline-flex bg-indigo-50 ${isActive("/report/saving") || isActive("/report/expense") ? "border-b-2 border-indigo-400 text-gray-900" : ""}`}>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium leading-4 rounded-md text-gray-500 bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none transition ease-in-out duration-150"
                      >
                        レポート
                        <svg
                          className="ms-2 -me-0.5 h-4 w-4"
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
                    <Dropdown.Link
                      href="/report/saving"
                      active={isActive("/report/saving")}
                    >
                      貯金額
                    </Dropdown.Link>
                    <Dropdown.Link
                      href="/report/expense"
                      active={isActive("/report/expense")}
                    >
                      支出額
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>

              <div className="hidden space-x-8 sm:ms-10 sm:flex items-center">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className={`inline-flex bg-indigo-50 ${isActive("/income") || isActive("/income/fixed") ? "border-b-2 border-indigo-400 text-gray-900" : ""}`}>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium leading-4 rounded-md text-gray-500 bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none transition ease-in-out duration-150"
                      >
                        収入管理
                        <svg
                          className="ms-2 -me-0.5 h-4 w-4"
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
                    <Dropdown.Link
                      href="/income"
                      active={isActive("/income")}
                    >
                      収入管理
                    </Dropdown.Link>
                    <Dropdown.Link
                      href="/income/fixed"
                      active={isActive("/income/fixed")}
                    >
                      固定収入
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>

              <div className="hidden space-x-8 sm:ms-10 sm:flex items-center">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className={`inline-flex bg-indigo-50 ${isActive("/expenditure") || isActive("/expenditure/fixed") ? "border-b-2 border-indigo-400 text-gray-900" : ""}`}>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium leading-4 rounded-md text-gray-500 bg-white hover:text-gray-700 hover:bg-gray-50 focus:outline-none transition ease-in-out duration-150"
                      >
                        支出管理
                        <svg
                          className="ms-2 -me-0.5 h-4 w-4"
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
                    <Dropdown.Link
                      href="/expense"
                      active={isActive("/expense")}
                    >
                      支出管理
                    </Dropdown.Link>
                    <Dropdown.Link
                      href="/expense/fixed"
                      active={isActive("/expense/fixed")}
                    >
                      固定支出
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>

              <div className="hidden space-x-8 sm:ms-10 sm:flex items-center">
                <NavLink
                  href="/category"
                  active={isActive("/category")}
                >
                  カテゴリー
                </NavLink>
              </div>

              <div className="hidden space-x-8 sm:ms-10 sm:flex items-center">
                <NavLink
                  href="/bulk-operations"
                  active={isActive("/bulk-operations")}
                >
                  CSV一括登録
                </NavLink>
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:ms-6">
              <div className="ms-3 relative">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                      >
                        {user?.name || 'ユーザー'}

                        <svg
                          className="ms-2 -me-0.5 h-4 w-4"
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
                    <Dropdown.Link
                      href="/profile"
                      active={isActive("/profile")}
                    >
                      プロフィール
                    </Dropdown.Link>
                    <Dropdown.Link href="/logout">
                      ログアウト
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>

            <div className="-me-2 flex items-center sm:hidden">
              <button
                onClick={() =>
                  setShowingNavigationDropdown(
                    (previousState) => !previousState
                  )
                }
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className={`${
                      showingNavigationDropdown ? "hidden" : "inline-flex"
                    }`}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={`${
                      showingNavigationDropdown ? "inline-flex" : "hidden"
                    }`}
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

        {/* レスポンシブメニュー */}
        <div
          className={`${
            showingNavigationDropdown ? "block" : "hidden"
          } sm:hidden`}
        >
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink
              href="/dashboard"
              active={isActive("/dashboard")}
            >
              ダッシュボード
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href="/income"
              active={isActive("/income")}
            >
              収入管理
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href="/incomes/fixed"
              active={isActive("/incomes/fixed")}
            >
              固定収入
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href="/expenditure"
              active={isActive("/expenditure")}
            >
              支出管理
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href="/expenses/fixed"
              active={isActive("/expenses/fixed")}
            >
              固定支出
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href="/category"
              active={isActive("/category")}
            >
              カテゴリー
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href="/bulk-operations"
              active={isActive("/bulk-operations")}
            >
              CSV一括登録
            </ResponsiveNavLink>
          </div>

          <div className="pt-4 pb-1 border-t border-gray-200">
            <div className="px-4">
              <div className="font-medium text-base text-gray-800">
                {user?.name || 'ユーザー'}
              </div>
              <div className="font-medium text-sm text-gray-500">
                {user?.email || 'user@example.com'}
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <ResponsiveNavLink href="/profile">
                プロフィール
              </ResponsiveNavLink>
              <ResponsiveNavLink href="/logout">
                ログアウト
              </ResponsiveNavLink>
            </div>
          </div>
        </div>
      </nav>

      {header && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
} 