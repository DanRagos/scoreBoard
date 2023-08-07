const paginationRevealingModule = (() => {
    const MAX_PAGE_DISPLAY = 7;

    const RIGHT_TRIGGER = MAX_PAGE_DISPLAY - 3;
    const LEFT_TRIGGER = 2;
    const FIRST_ITEM = 0;
    let LAST_ITEM = 6;

    let pagesLength = -1;
    let currentPage = -1;
    let paginationView = '';
    let paginationArray = [];

    create = ({ numberOfPages }) => {
        pagesLength = numberOfPages;
        currentPage = 1;
        _instantiateView();
    };

    next = (bypass = false) => {
        if (!_checkInstantiated()) {
            _notInstantiatedError();
        } else if (currentPage !== pagesLength) {
            currentPage++;
        } 
        _updateViewv2(bypass);
        return currentPage;
    };

    previous = () => {
        if (!_checkInstantiated()) {
            _notInstantiatedError();
        } else if (currentPage !== 1) {
            currentPage--;
        }
        _updateViewv2();
        return currentPage;
    };

    _checkInstantiated = () => {
        return currentPage !== -1;
    };

    _notInstantiatedError = () => {
        console.error('module not instantiated properly!');
    };

    printCurrentView = () => {
        return paginationView;
    };

    _instantiateView = () => {
        paginationArray = [];
        paginationView = '';
        for (let i = 1; i <= pagesLength; i++) {
            if (i === MAX_PAGE_DISPLAY - 1 && i !== pagesLength - 1) {
                paginationView += '\n...';
                paginationArray.push('...');
                continue;
            }

            if (i === MAX_PAGE_DISPLAY && i !== pagesLength) {
                paginationArray.push(`${pagesLength}`);
                paginationView += `\n${pagesLength}`;
                break;
            }

            paginationView += `\n${i}`;
            paginationArray.push(`${i}`);
        }
    };

    _finalView = () => {
        currentPage = RIGHT_TRIGGER;
        for (let i = RIGHT_TRIGGER; i < pagesLength; i++) {
            if (i === pagesLength - 1) {
                next(true);
            } else {
                next();
            }
            // next();
        }
    };

    _updateViewv2 = (bypass = false) => {
        // console.log('_updateViewv2()');
        //  check if current selection is a trigger
        const index = _findIndex({array: paginationArray, number: currentPage});
        // console.log(`index: ${index}`);
        if (index === FIRST_ITEM) {
            _instantiateView();
        } else if (index === LAST_ITEM && !bypass) {
            _finalView();
        }
        if (index === LEFT_TRIGGER && paginationArray[LEFT_TRIGGER - 1] === '...') {
            //  execute left trigger
            // console.log('%cleft trigger executed!', 'color: blue');
            const newPaginationArray = [];

            newPaginationArray.push(`1`);
            // console.log(`currentPage prev: ${currentPage}`)
            if (currentPage - 1 !== 3) {
                newPaginationArray.push(`...`);
                for (let i = 2; i < MAX_PAGE_DISPLAY - 2; i++) {
                    newPaginationArray.push(`${(parseInt(paginationArray[index]) - ( MAX_PAGE_DISPLAY - 2 - 2 ) + i)}`);
                }
                newPaginationArray.push('...');
                newPaginationArray.push(`${pagesLength}`);
            } else {
                for (let i = 1; i < MAX_PAGE_DISPLAY - 2; i++) {
                    newPaginationArray.push(`${(parseInt(paginationArray[index]) - ( MAX_PAGE_DISPLAY - 2 - 2 ) + i)}`);
                }
                newPaginationArray.push('...');
                newPaginationArray.push(`${pagesLength}`);
            }
            paginationArray = newPaginationArray;

        } else if (index === RIGHT_TRIGGER && paginationArray[RIGHT_TRIGGER + 1] === '...') {
            //  execute right trigger
            // console.log('%cright trigger executed!', 'color: blue');
            // console.log(`index val ${parseInt(paginationArray[index])}`);
            // console.log(`pageLength - 2: ${pagesLength - 2}`);
            const newPaginationArray = [];
            newPaginationArray.push(`1`);
            newPaginationArray.push(`...`);
            if (currentPage + 1 !== pagesLength - 2) {
                for (let i = 2; i < MAX_PAGE_DISPLAY - 2; i++) {
                    newPaginationArray.push(`${(parseInt(paginationArray[index]) - ( MAX_PAGE_DISPLAY - 2 - 2 ) + i)}`);
                }
                newPaginationArray.push('...');
                newPaginationArray.push(`${pagesLength}`);
            } else {
                for (let i = 2; i < MAX_PAGE_DISPLAY; i++) {
                    newPaginationArray.push(`${(parseInt(paginationArray[index]) - ( MAX_PAGE_DISPLAY - 2 - 2 ) + i)}`);
                }
            }
            paginationArray = newPaginationArray;
        }
        
        // console.log(`array`);
        // console.log(paginationArray);
    };

    _findIndex = ({array, number}) => {
        for(let i = 0; i < array.length; i++) {
            if ( parseInt(array[i]) === number ) {
                return i;
            }
        }
    };

    getPaginationArray = () => {
        return paginationArray;
    };

    getHtml = () => {
        const spanArray = [];
        paginationArray.forEach((p) => {
            const disabled = p === '...';
            const active = parseInt(p) === currentPage;
            let classStyle = 'pagination-item';
            if (disabled) {
                classStyle += ' disabled';
            } else if (active) {
                classStyle += ' active-item';
            }
            spanArray.push(`<button class="${classStyle}">${p}</button>`);
        });
        return spanArray;
    };

    navigateToPage = (n) => {
        currentPage = n;
        _updateViewv2();
    };

    return {
        previous: previous,
        next: next,
        create: create,
        printCurrentView: printCurrentView,
        getPaginationArray: getPaginationArray,
        getHtml: getHtml,
        navigateToPage: navigateToPage,
    };
});

const createNewPaginationInstance = () => {
    return paginationRevealingModule();
}