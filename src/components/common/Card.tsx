import React from "react";
import Modal from "./Modal";

interface CardProps {
  posterLink?: string;
  title: string;
  id: number;
  type: "tv" | "movie";
  className?: string;
}

const Card: React.FC<CardProps> = ({ posterLink, title, id, type }): JSX.Element => {
  const [open, isOpen] = React.useState(false);
  return (
    <>
      <div className="card__container animated fadeIn">
        <img
          className="card__image"
          onClick={(): void => isOpen(true)}
          src={
            posterLink
              ? `http://image.tmdb.org/t/p/w300/${posterLink}`
              : "https://www.rspcansw.org.au/wp-content/themes/noPhotoFound.png"
          }
          style={{ border: posterLink ? "none" : "1px solid white" }}
          alt={title}
        />
        {/* <p className="card__text">{title}</p> */}
      </div>
      {open && (
        <Modal isOpen={open} closeModal={(): void => isOpen(false)} id={id} type={type} />
      )}
    </>
  );
};

export default Card;
