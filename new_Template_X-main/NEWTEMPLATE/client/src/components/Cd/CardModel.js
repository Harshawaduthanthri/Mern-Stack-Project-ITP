import { AiOutlineClose } from "react-icons/ai";
import { FaCreditCard } from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";

function CardModel({ card, onClose }) {
  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="w-[600px] max-w-full h-[400px] bg-white rrounded-xl p-4 flex flex-col relative"
        onClick={(event) => event.stopPropagation()}
      >
        <AiOutlineClose
          className="absolute right-6 top-6 text-3xl text-red-600 cursor-pointer"
          onClick={onClose}
        />
        <h2 className="w-fit px-4 py-1 bg-red-300 rounded-lg ">
          {card.exdate &&
            new Date(card.exdate).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
            })}
        </h2>
        <h4 className="my-2 text-gray-500">{card._id}</h4>
        <div className="flex justify-star items-center gap-x-2">
          <FaCreditCard className="text-red-300 text-2xl" />
          <h2 className="my-1">{card.number} </h2>
        </div>
        <div className="flex justify-star items-center gap-x-2">
          <BiUserCircle className="text-red-300 text-2xl" />
          <h2 className="my-1">{card.name} </h2>
        </div>
      </div>
    </div>
  );
}

export default CardModel;
