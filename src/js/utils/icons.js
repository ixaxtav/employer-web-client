/* global FontAwesomeConfig */
import fontawesome from '@fortawesome/fontawesome';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';
import faEmptyStar from '@fortawesome/fontawesome-free-regular/faStar';
import faStarHalf from '@fortawesome/fontawesome-free-solid/faStarHalf';
import faTimesCircle from '@fortawesome/fontawesome-free-solid/faTimesCircle';
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faAngleDoubleRight from '@fortawesome/fontawesome-free-solid/faAngleDoubleRight';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestion';
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers';
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle';
import faDollarSign from '@fortawesome/fontawesome-free-solid/faDollarSign';

fontawesome.config = {
  autoReplaceSvg: 'nest'
};
fontawesome.library.add(
    faStar, faStarHalf, faEmptyStar, faTimesCircle, faCheckCircle, faAngleDoubleRight,
    faTrashAlt, faQuestion, faPencilAlt, faPlus, faUsers, faExclamationTriangle, faDollarSign
);