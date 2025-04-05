interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
	return (
		<header className=' bg-opacity-50 backdrop-blur-md shadow-lg border-b -z-10 ...' >
			<div className=' mx-auto py-4 px-4 sm:px-6 lg:px-8'>
				<h1 className='text-2xl font-semibold '>{title}</h1>
			</div>
		</header>
		
	);
};
export default Header;
