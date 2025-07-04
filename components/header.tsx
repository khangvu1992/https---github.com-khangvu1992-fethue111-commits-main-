interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
	return (
		<header className='  border-b -z-10 bg-gray-300 ...' >
			<div className=' mx-auto py-2 px-2 sm:px-4 lg:px-4'>
				<h1 className='text-xl font-semibold '>{title}</h1>
			</div>
		</header>
		
	);
};
export default Header;



