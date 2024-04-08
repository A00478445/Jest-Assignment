const React = require('react');
const { render } = require('@testing-library/react');
const App = require('./App');

// 1. Unit test to check if the title "Hello Canada" is displayed
test('Title "Hello Canada" is displayed', () => {
  // Render the App component
  const app = React.createElement(App);
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(app, { container });

  // Get the title element by its text content
  const titleElement = container.querySelector('h1');

  // Assert that the title element is not null
  expect(titleElement).not.toBeNull();

  // Assert that the title element's text content is "Hello Canada"
  expect(titleElement.textContent).toBe('Hello Canada');
});

// 2. Unit test to check if the Canadian flag is displayed
test('Canadian flag image is correctly displayed', () => {
  // Render the App component
  render(<App />);
  
  // Find the image element by its alt attribute
  const flagImage = screen.getByAltText("Canada's Flag");

  // Assert that the flag image is present
  expect(flagImage).toBeInTheDocument();
});

// 3. Unit test to test if switching to territories data will update the displayed data
test('Switching to territories data updates the displayed data', () => {
  // Render the App component
  render(<App />);
  
  // Simulate a click event on the "Territories" menu item
  const territoriesMenuItem = screen.getByText('Territories');
  fireEvent.click(territoriesMenuItem);

  // Check if the displayed data updates to territories data
  const territoriesData = screen.getByText('Territories Data'); // Adjust this line according to your implementation
  expect(territoriesData).toBeInTheDocument();
});


// 4. Unit test to test table
test('Rendering of menu items', () => {
  // Render the App component
  render(<App />);
  
  // Find the menu items for provinces and territories
  const provincesMenuItem = screen.getByText('Provinces');
  const territoriesMenuItem = screen.getByText('Territories');

  // Assert that both menu items are rendered with the correct text
  expect(provincesMenuItem).toBeInTheDocument();
  expect(territoriesMenuItem).toBeInTheDocument();

  // Simulate a click event on the "Provinces" menu item
  fireEvent.click(provincesMenuItem);

  // Check if the data type is updated to "provinces"
  expect(screen.getByText('provinces')).toBeInTheDocument();

  // Simulate a click event on the "Territories" menu item
  fireEvent.click(territoriesMenuItem);

  // Check if the data type is updated to "territories"
  expect(screen.getByText('territories')).toBeInTheDocument();
});


// 5. Unit test to test fetching provinces data
// Mock the API response for provinces data
jest.mock('./components/list', () => ({
  __esModule: true,
  default: ({ data }) => (
    <ul>
      {data.map((province, index) => (
        <li key={index}>{province.name}</li>
      ))}
    </ul>
  ),
}));

test('Fetching provinces data displays the data correctly', async () => {
  // Mock the API response
  const provincesData = [
    { name: 'Province 1' },
    { name: 'Province 2' },
    { name: 'Province 3' },
  ];
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    json: async () => provincesData,
  });

  // Render the App component
  const { getByText } = render(<App />);

  // Wait for the provinces data to be fetched and displayed
  await waitFor(() => {
    provincesData.forEach(({ name }) => {
      expect(getByText(name)).toBeInTheDocument();
    });
  });
});