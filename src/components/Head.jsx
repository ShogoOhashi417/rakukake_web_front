import React from 'react';

// このコンポーネントは実際にはタイトルを変更しません
// 本来はreact-helmetなどのライブラリを使用するか、
// 親コンポーネントで直接document.titleを設定するべきです
const Head = ({ title }) => {
  React.useEffect(() => {
    if (title) {
      document.title = title;
    }
    return () => {
      // コンポーネントのアンマウント時に何もしない
    };
  }, [title]);

  return null;
};

export default Head; 