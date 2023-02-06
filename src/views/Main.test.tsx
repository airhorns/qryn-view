import '../../mocks/matchmedia.mock.ts';
import '@testing-library/jest-dom'
import {cleanup} from '@testing-library/react';
import Main from './Main';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, {shallow, mount} from 'enzyme';
import { themes } from '../theme/themes';
import { Provider } from 'react-redux'
import store from '../store/store';
import { MobileView } from './Main/MobileView';
import { DesktopView } from './Main/DesktopView';

const ReduxProvider = ({ children, reduxStore }: any) => (
  <Provider store={reduxStore}>{children}</Provider>
)
Enzyme.configure({adapter: new Adapter()});

// // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// // unmount and cleanup DOM after the test is finished.
afterEach(cleanup);
const windowResize = (x: number) => {
    window.innerWidth = x;
    window.dispatchEvent(new Event('resize'));
}
describe('Main Component', () => {
    const rwrapper = ({ children }:any ) => (
    <ReduxProvider reduxStore={store}>{children}</ReduxProvider>
  );
    it('renders DesktopView component when window is normal size', () => {
      const wrapper = mount(rwrapper(<Main  />));
      expect(wrapper.containsMatchingElement(<DesktopView isEmbed={false} isSplit={false} theme={themes['light']} settingsDialogOpen={false} />)).toEqual(false);
    });
    it('render MobileView component when window is small size', () => {
        windowResize(900)
        const wrapper = shallow(rwrapper(<Main  />));
        expect(wrapper.containsMatchingElement(<MobileView isEmbed={false} theme={themes['light']} settingsDialogOpen={false} />)).toEqual(false);
    })
});
