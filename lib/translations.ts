export const translations = {
  hi: {
    // Auth pages
    welcome: 'फास्टबिल में स्वागत है',
    phoneNumber: 'फोन नंबर',
    shopName: 'दुकान का नाम',
    selectLanguage: 'भाषा चुनें',
    hindi: 'हिंदी',
    english: 'English',
    getStarted: 'शुरू करें',
    enterOTP: 'OTP दर्ज करें',
    sendOTP: 'OTP भेजें',
    verifyOTP: 'सत्यापित करें',
    logout: 'लॉग आउट',

    // Dashboard
    dashboard: 'डैशबोर्ड',
    newInvoice: 'नई बिल',
    todaysSales: 'आज की बिक्री',
    myItems: 'सामान',
    settings: 'सेटिंग्स',
    help: 'मदद',

    // Invoice
    createInvoice: 'नई बिल बनाएं',
    customerName: 'ग्राहक का नाम',
    itemName: 'सामान का नाम',
    quantity: 'मात्रा',
    price: 'कीमत',
    addItem: 'सामान जोड़ें',
    createBill: 'बिल तैयार करो',
    print: 'प्रिंट करें',
    share: 'साझा करें',
    total: 'कुल',
    date: 'दिन',
    time: 'समय',
    thankyou: 'धन्यवाद!',

    // Sales
    totalSales: 'कुल बिक्री',
    lastSevenDaysAverage: 'पिछले 7 दिनों का औसत',
    notes: 'नोट्स',
    save: 'सेव',

    // Inventory
    inventoryList: 'सामान की सूची',
    addNewItem: 'नया सामान जोड़ें',
    itemList: 'सामान सूची',

    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफल',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    back: 'वापस',
    next: 'आगे',
    done: 'पूरा',
  },
  en: {
    // Auth pages
    welcome: 'Welcome to FastBill',
    phoneNumber: 'Phone Number',
    shopName: 'Shop Name',
    selectLanguage: 'Select Language',
    hindi: 'हिंदी',
    english: 'English',
    getStarted: 'Get Started',
    enterOTP: 'Enter OTP',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify',
    logout: 'Logout',

    // Dashboard
    dashboard: 'Dashboard',
    newInvoice: 'New Invoice',
    todaysSales: "Today's Sales",
    myItems: 'My Items',
    settings: 'Settings',
    help: 'Help',

    // Invoice
    createInvoice: 'Create New Invoice',
    customerName: 'Customer Name',
    itemName: 'Item Name',
    quantity: 'Quantity',
    price: 'Price',
    addItem: 'Add Item',
    createBill: 'Create Invoice',
    print: 'Print',
    share: 'Share',
    total: 'Total',
    date: 'Date',
    time: 'Time',
    thankyou: 'Thank You!',

    // Sales
    totalSales: 'Total Sales',
    lastSevenDaysAverage: 'Last 7 Days Average',
    notes: 'Notes',
    save: 'Save',

    // Inventory
    inventoryList: 'Item List',
    addNewItem: 'Add New Item',
    itemList: 'Your Items',

    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    done: 'Done',
  }
}

export type Language = 'hi' | 'en'

export const t = (key: string, lang: Language = 'hi'): string => {
  const keys = key.split('.')
  let value: any = translations[lang]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
