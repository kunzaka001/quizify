type CardProps = {
  title: string;
  des: string;
  buttext: string;
  onButtonClick?: (selectedDifficulty: string) => void;
  difficulty: string;
};

const Card = ({
  title,
  des,
  buttext,
  onButtonClick,
  difficulty,
}: CardProps) => {
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick(difficulty);
    }
  };

  return (
    <div className="max-w-sm bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
      <a href="#">
        <img
          className="rounded-t-lg w-full h-48 object-cover"
          src="q.png"
          alt="Card image"
        />
      </a>
      <div className="p-6">
        <a href="#">
          <h5 className="mb-3 text-2xl font-semibold tracking-tight text-gray-900 hover:text-blue-600 transition-colors duration-300">
            {title}
          </h5>
        </a>
        <p className="mb-4 text-gray-600">{des}</p>
        <button
          onClick={handleClick}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors duration-300"
        >
          {buttext}
          <svg
            className="w-4 h-4 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Card;
