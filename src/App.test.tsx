import '@testing-library/jest-dom'
import {cleanup} from '@testing-library/react';
import App from './App';
import Main from './views/Main';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, {shallow} from 'enzyme';

Enzyme.configure({adapter: new Adapter()});

// // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// // unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

describe('App Component', () => {
    it('renders Main component', () => {
      const wrapper = shallow(<App  />);
      expect(wrapper.containsMatchingElement(<Main />)).toEqual(true);
    });
});
