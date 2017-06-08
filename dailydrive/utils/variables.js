import moment from 'moment';
import { Dimensions } from 'react-native';

export const TODAY = moment().format('YYYY-MM-DD');
export const NOW = moment().format();
export const CURRENT_DATE = moment().format('dddd, MMMM Do YYYY');

export const titleHeight = 10;

export const width = Dimensions.get('window').width;
export const height = Dimensions.get('window').height;
