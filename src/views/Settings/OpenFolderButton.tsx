import { Folder, FolderOpen } from 'phosphor-react';
import { useState } from 'react';

const OpenFolderButton: React.FC<React.HTMLAttributes<HTMLButtonElement>> = ({
  onClick,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      data-kind='icon'
      disabled
      onClick={(e) => {
        setIsOpen((prev) => !prev);
        if (onClick) onClick(e);
      }}
      {...props}
    >
      {isOpen ? (
        <FolderOpen size={25} color='#bb9af7' weight='duotone' />
      ) : (
        <Folder size={25} color='#bb9af7' weight='duotone' />
      )}
    </button>
  );
};

export default OpenFolderButton;
