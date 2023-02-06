import '@testing-library/jest-dom'
import {cleanup} from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json'
import { Provider } from 'react-redux';
import LabelsList from './LabelsList';
import store from '../../../../store/store'
import { mockPropsData } from '../../../../../mocks/baseProps.mock';
Enzyme.configure({adapter: new Adapter()});
// // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// // unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

describe('Label List Component', () => {
    it('renders correctly', () => {
        const wrapper = shallow(<Provider store={store}><LabelsList {...mockPropsData}></LabelsList></Provider>)
        expect(toJson(wrapper.dive())).toMatchSnapshot();
      });
});
