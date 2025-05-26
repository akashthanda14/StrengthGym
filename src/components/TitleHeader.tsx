interface TitleHeaderProps {
  title: string;
  sub: React.ReactNode;
}

const TitleHeader = ({ title, sub }: TitleHeaderProps) => {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
      <div className="text-white/60">{sub}</div>
    </div>
  );
};

export default TitleHeader;