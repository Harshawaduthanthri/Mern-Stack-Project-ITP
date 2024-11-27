import { Link } from "react-router-dom";
import { FaCreditCard } from "react-icons/fa";
import { BiUserCircle, BiShow } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import { useState } from "react";
import CardModel from "./CardModel";

function SingleCard({ card }) {
  const [showModel, setShowModel] = useState(false);

  return (
    <div style={{
      width: '25%', /* Width set to 48% for each card */
      
      border: '1px solid lightgray',
      borderRadius: '8px',
      padding: '8px',
      margin: '8px',
      position: 'relative',
      backgroundColor: '#e0f7fa',  /* Light blue color */
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      display: 'inline-block',  /* Display each card inline */
    }}>
      <h2 style={{
        position: 'absolute',
        top: '0',
        right: '0',
        padding: '4px 8px',
        backgroundColor: '#ff4d4d',
        borderRadius: '4px',
        fontSize: '12px',
        color: 'white',
      }}>
        {card.exdate && new Date(card.exdate).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
        })}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaCreditCard style={{ color: '#ff4d4d', fontSize: '24px' }} />
        <h2 style={{ margin: '4px 0', color: '#333', fontSize: '14px' }}>{card.number}</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BiUserCircle style={{ color: '#3498db', fontSize: '24px' }} />
        <h2 style={{ margin: '4px 0', color: '#333', fontSize: '14px' }}>{card.name}</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
        <BiShow
          style={{
            fontSize: '24px',
            color: '#3498db',
            cursor: 'pointer',
            marginRight: '8px',
          }}
          onClick={() => setShowModel(true)}
        />
        <Link to={`/cards/details/${card._id}`} style={{ color: '#28a745', marginRight: '8px' }}>
          <BsInfoCircle style={{ fontSize: '24px' }} />
        </Link>
        <Link to={`/cards/edit/${card._id}`} style={{ color: '#f1c40f', marginRight: '8px' }}>
          <AiOutlineEdit style={{ fontSize: '24px' }} />
        </Link>
        <Link to={`/cards/delete/${card._id}`} style={{ color: '#e74c3c' }}>
          <MdOutlineDelete style={{ fontSize: '24px' }} />
        </Link>
      </div>
      {showModel && (
        <CardModel card={card} onClose={() => setShowModel(false)} />
      )}
    </div>
    
  );
}

export default SingleCard;
