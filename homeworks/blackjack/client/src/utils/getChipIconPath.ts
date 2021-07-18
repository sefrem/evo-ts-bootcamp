import { ChipsValues } from '../types/types';
import chip10 from '../assets/icons/chips/chip_10.svg';
import chip25 from '../assets/icons/chips/chip_25.svg';
import chip50 from '../assets/icons/chips/chip_50.svg';
import chip100 from '../assets/icons/chips/chip_100.svg';

export function getChipIconPath(value: ChipsValues) {
    switch (value) {
        case '10':
            return chip10;
        case '25':
            return chip25;
        case '50':
            return chip50;
        case '100':
            return chip100;
    }
}
