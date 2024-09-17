import React from 'react';

const Profile = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {userInfo?.fullName
          .split(' ')
          .map(word => word[0].toUpperCase())
          .join('')}
      </div>

      <div>
        <p className="text-sm font-medium">{userInfo?.fullName}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Profile;
