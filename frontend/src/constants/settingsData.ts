import { settingsDataType } from '../interfaces/settingsDataType';

const settingsData: settingsDataType[] = [
	{
		id: 'Personal Data',
		getWrapper: (user) => `${user.firstName} ${user.lastName}`,
		getItems: (user) => [
			{
				header: 'First Name',
				text: user.firstName
			},
			{
				header: 'Last Name',
				text: user.lastName
			}
		]
	},
	{
		id: 'Email',
		getWrapper: (user) => user.email,
		getItems: (user) => [
			{
				header: 'Email',
				text: user.email
			}
		]
	},
	{
		id: 'Password',
		getWrapper: () => '********',
		getItems: () => [
			{
				header: 'Password',
				text: '********'
			}
		]
	}
];

export default settingsData;
