import { HiOutlineArrowDownCircle , HiOutlineArrowUpCircle } from 'react-icons/hi2';

interface AccordionProps {
  id: number;
  title: React.ReactNode;
  content: React.ReactNode;
  openButtonLabel?: React.ReactNode;
  closeButtonLabel?: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (id: number) => void;
}

const Accordion = ({
  id,
  title,
  content,
  openButtonLabel = <div className='felx text-2xl text-primary'><HiOutlineArrowDownCircle/></div>,
  closeButtonLabel = <div className='felx text-2xl text-primary'><HiOutlineArrowUpCircle/></div>,
  isOpen,
  onToggle,
}: AccordionProps) => {
  const handleToggle = () => {
    if (onToggle) onToggle(id);
  };

  return (
    <div className="border p-4 rounded-md">
      <div
        className="cursor-pointer flex justify-between items-center"
        onClick={handleToggle}
      >
        <div>{title}</div>
        <span className="text-gray-600">
          {isOpen ? closeButtonLabel : openButtonLabel}
        </span>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="mt-4 space-y-2">{content}</div>
      </div>
    </div>
  );
};

export default Accordion;