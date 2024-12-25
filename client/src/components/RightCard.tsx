interface CardProps {
  title: string;
  author: string;
  date: string;
}

function Card({ title, author, date }: CardProps) {
  return (
    <div className="w-full flex flex-col gap-2 mb-6 min-w-80">
      <div className="text-slate-500 text-sm font-poppins flex gap-1">
        <div className="h-4 w-4">
          <img src="/postly.jpg" className="h-4 w-4" alt="" />
        </div>
        <div>
          In <span className="text-black ">The PostLy Blog </span>
        </div>
        <div>
          by <span className="text-black">{author}</span>
        </div>
      </div>
      <div className="font-bold text-black text-lg  max-w-80">{title}</div>
      <div className="text-slate-500 text-sm">{date}</div>
    </div>
  );
}

function RightCard() {
  const cardData: CardProps[] = [
    {
      title: "How to Build a Blog kjnkkkj n kjkjkjbkb ",
      author: "John Doe",
      date: "December 24, 2024",
    },
    {
      title: "10 Tips for Writing",
      author: "Jane Smith",
      date: "December 23, 2024",
    },
    {
      title: "Boost Your Creativity",
      author: "Alice Johnson",
      date: "December 22, 2024",
    },
  ];

  return (
    <div className="w-full h-screen p-10 min-w-80 border-l border-l-gray-300-">
      <div className="font-semibold font-poppins text-xl mb-6">Staff Picks</div>
      <div>
        {cardData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            author={card.author}
            date={card.date}
          />
        ))}
      </div>
    </div>
  );
}

export default RightCard;
