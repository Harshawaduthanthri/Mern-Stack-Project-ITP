import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox,MdOutlineDelete } from "react-icons/md";


function CardTable({ cards}) {
  return (
    <table className="table">
                <thead>
                    <tr>
                        <th className="border1">No</th>
                        <th className="border1">Card No</th>
                        <th className="border1 max-md">Name</th>
                        <th className="border1 max-md">Ex.Date</th>
                        <th className="border1 max-md">CVV</th>
                        <th className="border1">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {cards && cards.map((card,index)=>(
                        <tr key={card._id} className="h-8">
                            <td className="text-center"> 
                                {index + 1}
                            </td>
                            <td className="text-center"> 
                                {card.number}
                            </td>
                            <td className="text-center max-md"> 
                                {card.name}   
                            </td>
                            <td className="text-center max-md"> 
                                {card.exdate}   
                            </td>
                            <td className="text-center max-md"> 
                                {card.cvv}   
                            </td>
                            <td className="text-center"> 
                                <div className="flex2 justify-center gap-x-4">
                                    <Link to={`/cards/details/${card._id}`}>
                                        <BsInfoCircle className="green" />
                                    </Link>
                                    <Link to={`/cards/edit/${card._id}`}>
                                        <AiOutlineEdit className="yellow" />
                                    </Link>
                                    <Link to={`/cards/delete/${card._id}`}>
                                        <MdOutlineDelete className="red" />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
  )
}

export default CardTable