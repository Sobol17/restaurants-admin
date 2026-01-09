export const authKeys = {
    all: ['auth'],
}

export const adsKeys = {
    all: ['ads'],
    lists: () => [...adsKeys.all, 'list'],
    list: (filters = {}) => [...adsKeys.lists(), filters],
    details: () => [...adsKeys.all, 'detail'],
    detail: id => [...adsKeys.details(), id],
}

export const customersKeys = {
    all: ['customers'],
    lists: () => [...customersKeys.all, 'list'],
    list: (filters = {}) => [...customersKeys.lists(), filters],
    details: () => [...customersKeys.all, 'detail'],
    detail: id => [...customersKeys.details(), id],
}

export const couriersKeys = {
    all: ['couriers'],
    lists: () => [...couriersKeys.all, 'list'],
    list: (filters = {}) => [...couriersKeys.lists(), filters],
    details: () => [...couriersKeys.all, 'detail'],
    detail: id => [...couriersKeys.details(), id],
}

export const restaurantsKeys = {
    all: ['restaurants'],
    lists: () => [...restaurantsKeys.all, 'list'],
    list: (filters = {}) => [...restaurantsKeys.lists(), filters],
    details: () => [...restaurantsKeys.all, 'detail'],
    detail: id => [...restaurantsKeys.details(), id],
}

export const ordersKeys = {
    all: ['orders'],
    lists: () => [...ordersKeys.all, 'list'],
    list: (filters = {}) => [...ordersKeys.lists(), filters],
    details: () => [...ordersKeys.all, 'detail'],
    detail: id => [...ordersKeys.details(), id],
}
