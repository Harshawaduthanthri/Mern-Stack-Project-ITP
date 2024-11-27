import { Link } from "react-router-dom";
import { FaCreditCard } from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import SingleCard from "./SingleCard";

function Card({ cards }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((item) => (
        <SingleCard key={item._id} card={item} />
      ))}
    </div>
  );
}

export default Card;
