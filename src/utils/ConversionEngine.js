import Papa from 'papaparse';

class ConversionEngine {

  static getStateCode(stateName) {
    if (!stateName) return '';
    
    const stateMap = {
      'JAMMU AND KASHMIR': '1', 'HIMACHAL PRADESH': '2', 'PUNJAB': '3',
      'CHANDIGARH': '4', 'UTTARAKHAND': '5', 'HARYANA': '6', 'DELHI': '7',
      'RAJASTHAN': '8', 'UTTAR PRADESH': '9', 'BIHAR': '10', 'SIKKIM': '11',
      'ARUNACHAL PRADESH': '12', 'NAGALAND': '13', 'MANIPUR': '14',
      'MIZORAM': '15', 'TRIPURA': '16', 'MEGHALAYA': '17', 'ASSAM': '18',
      'WEST BENGAL': '19', 'JHARKHAND': '20', 'ODISHA': '21',
      'CHHATTISGARH': '22', 'MADHYA PRADESH': '23', 'GUJARAT': '24',
      'DAMAN AND DIU': '25', 'DADRA AND NAGAR HAVELI': '26',
      'MAHARASHTRA': '27', 'ANDHRA PRADESH': '28', 'KARNATAKA': '29',
      'GOA': '30', 'LAKSHADWEEP': '31', 'KERALA': '32', 'TAMIL NADU': '33',
      'PUDUCHERRY': '34', 'ANDAMAN AND NICOBAR ISLANDS': '35',
      'TELANGANA': '36', 'ANDHRA PRADESH (NEW)': '37', 'LADAKH': '38'
    };

    const normalized = stateName.trim().toUpperCase();
    return stateMap[normalized] || '';
  }

  static mapUnit(unit) {
    if (!unit) return 'OTH';
    const unitMap = {
      'BAG': 'BAG', 'BAGS': 'BAG', 'BOTTLE': 'BTL', 'BOTTLES': 'BTL',
      'BOX': 'BOX', 'BOXES': 'BOX', 'BUNDLES': 'BDL', 'CANS': 'CAN',
      'CARTONS': 'CTN', 'DOZEN': 'DOZ', 'GRAMMES': 'GMS', 'GRAMS': 'GMS',
      'KILOGRAMS': 'KGS', 'KILOLITRE': 'KLR', 'LITRES': 'LTR',
      'METERS': 'MTR', 'MILLILITRE': 'MLT', 'NUMBERS': 'NOS',
      'PACKS': 'PAC', 'PAIRS': 'PRS', 'PIECES': 'PCS', 'QUINTAL': 'QTL',
      'ROLLS': 'ROL', 'SETS': 'SET', 'SQUARE FEET': 'SQF',
      'SQUARE METERS': 'SQM', 'TABLETS': 'TBS', 'TEN GROSS': 'TGM',
      'THOUSANDS': 'THD', 'TONNES': 'TON', 'TUBES': 'TUB', 'UNITS': 'UNT',
      'US GALLONS': 'UGS', 'YARDS': 'YDS'
    };
    return unitMap[unit.toUpperCase()] || 'OTH';
  }

  static convertCSVtoJSON(csvContent) {
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });

    if (parsed.errors.length > 0) {
      throw new Error(`CSV parsing error: ${parsed.errors[0].message}`);
    }

    const rows = parsed.data;
    if (rows.length === 0) {
      throw new Error('CSV file is empty');
    }

    const invoiceMap = new Map();

    rows.forEach((row, index) => {
      const invoiceNo = row['Document Number'];
      if (!invoiceNo) {
        console.warn(`Row ${index + 1}: Missing invoice number, skipping`);
        return;
      }

      if (!invoiceMap.has(invoiceNo)) {
        invoiceMap.set(invoiceNo, {
          header: row,
          items: []
        });
      }

      invoiceMap.get(invoiceNo).items.push(row);
    });

    const invoices = Array.from(invoiceMap.values()).map(({ header, items }) =>
      this.buildInvoiceObject(header, items)
    );

    return invoices;
  }

  static buildInvoiceObject(header, items) {
    const parseNumber = (value) => {
      if (value === null || value === undefined || value === '') return 0;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const parseInteger = (value) => {
      if (value === null || value === undefined || value === '') return 0;
      const parsed = parseInt(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const day = parts[0].trim().padStart(2, '0');
          const month = parts[1].trim().padStart(2, '0');
          const year = parts[2].trim();
          return `${day}/${month}/${year}`;
        }
      }
      
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const day = parts[0].trim().padStart(2, '0');
          const month = parts[1].trim().padStart(2, '0');
          let year = parts[2].trim();
          if (year.length === 2) {
            year = '20' + year;
          }
          return `${day}/${month}/${year}`;
        }
      }
      
      return dateStr;
    };

    const getValue = (value) => {
      if (value === null || value === undefined || value === '') return null;
      return value;
    };

    const itemList = items.map((item, idx) => {
      const slNo = item['Sl.No.'] || (idx + 1).toString();
      const qty = parseNumber(item['Quantity']);
      const gstRate = parseNumber(item['GST Rate (%)']);
      
      return {
        SlNo: slNo,
        PrdDesc: getValue(item['Product Description']) || '',
        IsServc: item['Is Service'] === 'Yes' ? 'Y' : 'N',
        HsnCd: getValue(item['HSN Code']) || '',
        Qty: qty,
        Unit: this.mapUnit(item['Unit']),
        UnitPrice: parseNumber(item['Unit Price']),
        TotAmt: parseNumber(item['Gross Amount']),
        Discount: parseNumber(item['Discount']),
        PreTaxVal: parseNumber(item['Pre Tax Value']),
        AssAmt: parseNumber(item['Taxable Value']),
        GstRt: gstRate,
        IgstAmt: parseNumber(item['Igst Amt (Rs)']),
        CgstAmt: parseNumber(item['Cgst Amt (Rs)']),
        SgstAmt: parseNumber(item['Sgst Amt (Rs)']),
        CesRt: parseNumber(item['Cess Rate (%)']),
        CesAmt: parseNumber(item['Cess Amt Adval (Rs)']),
        CesNonAdvlAmt: parseNumber(item['Cess Amt non Adval (Rs)']),
        StateCesRt: parseNumber(item['State Cess Rate (%)']),
        StateCesAmt: parseNumber(item['State Cess Adval Amt (Rs)']),
        StateCesNonAdvlAmt: parseNumber(item['State Cess non Adval Amt (Rs)']),
        OthChrg: parseNumber(item['Other Charges']),
        TotItemVal: parseNumber(item['Item Total'])
      };
    });

    const totals = itemList.reduce((acc, item) => ({
      taxableValue: acc.taxableValue + item.AssAmt,
      sgstAmt: acc.sgstAmt + item.SgstAmt,
      cgstAmt: acc.cgstAmt + item.CgstAmt,
      igstAmt: acc.igstAmt + item.IgstAmt,
      cesAmt: acc.cesAmt + item.CesAmt,
      stateCesAmt: acc.stateCesAmt + item.StateCesAmt,
      totItemVal: acc.totItemVal + item.TotItemVal
    }), { taxableValue: 0, sgstAmt: 0, cgstAmt: 0, igstAmt: 0, cesAmt: 0, stateCesAmt: 0, totItemVal: 0 });
    
    const round2 = (num) => Math.round(num * 100) / 100;
    
    const taxableValue = round2(totals.taxableValue);
    const sgstAmt = round2(totals.sgstAmt);
    const cgstAmt = round2(totals.cgstAmt);
    const igstAmt = round2(totals.igstAmt);
    const cesAmt = round2(totals.cesAmt);
    const stateCesAmt = round2(totals.stateCesAmt);
    const discount = 0;
    const othChrg = 0;
    const roundOff = round2(parseNumber(header['Round Off']));
    const totalInvVal = round2(totals.totItemVal + roundOff);

    const invoice = {
      Version: "1.1",
      TranDtls: {
        TaxSch: "GST",
        SupTyp: header['Supply Type Code'] || 'B2B',
        IgstOnIntra: header['Igst on Intra'] === 'Yes' ? 'Y' : 'N',
        RegRev: getValue(header['Reverse Charges']) === 'Yes' ? 'Y' : null,
        EcmGstin: getValue(header['e-Comm GSTIN'])
      },
      DocDtls: {
        Typ: header['Document Type'] === 'Tax Invoice' ? 'INV' : header['Document Type'],
        No: getValue(header['Document Number']) || '',
        Dt: formatDate(header['Document Date'])
      },
      SellerDtls: {
        Gstin: "22AAEFC9971E1ZI",
        LglNm: "CHHATTISGARH MEDICOSE",
        TrdNm: "CHHATTISGARH MEDICOSE ",
        Addr1: "A/7 VIDYA VIHAR NEHRU NAGAR  WEST ",
        Addr2: "A/7 VIDYA VIHAR NEHRU NAGAR WEST ",
        Loc: "DURG",
        Pin: 490020,
        Stcd: "22",
        Ph: "7000311132",
        Em: "chhattisgarhmedicose@gmail.com"
      },
      BuyerDtls: {
        Gstin: getValue(header['Buyer GSTIN']) || '',
        LglNm: getValue(header['Buyer Legal Name']) || '',
        TrdNm: getValue(header['Buyer Trade Name']) || '',
        Pos: this.getStateCode(header['Buyer POS'] || header['Buyer State']),
        Addr1: getValue(header['Buyer Addr1']) || '',
        Addr2: getValue(header['Buyer Addr2']),
        Loc: getValue(header['Buyer Location']) || '',
        Pin: parseInteger(header['Buyer Pin Code']),
        Stcd: this.getStateCode(header['Buyer State']),
        Ph: getValue(header['Buyer Phone Number']),
        Em: getValue(header['Buyer Email id'])
      },
      ShipDtls: this.buildShippingDetails(header),
      ValDtls: {
        AssVal: taxableValue,
        IgstVal: igstAmt,
        CgstVal: cgstAmt,
        SgstVal: sgstAmt,
        CesVal: cesAmt,
        StCesVal: stateCesAmt,
        Discount: discount,
        OthChrg: othChrg,
        RndOffAmt: roundOff,
        TotInvVal: totalInvVal,
        TotInvValFc: 0
      },
      PayDtls: null,
      RefDtls: null,
      AddlDocDtls: [
        {
          Url: null,
          Docs: null,
          Info: null
        }
      ],
      ItemList: itemList
    };

    return invoice;
  }

  static buildShippingDetails(header) {
    const getValue = (value) => {
      if (value === null || value === undefined || value === '') return null;
      return value;
    };

    const parseInteger = (value) => {
      if (value === null || value === undefined || value === '') return 0;
      const parsed = parseInt(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const hasShippingInfo = 
      getValue(header['Shipping GSTIN']) ||
      getValue(header['Shipping Legal Name']) ||
      getValue(header['Shipping Trade Name']) ||
      getValue(header['Shipping Addr1']) ||
      getValue(header['Shipping Location']);

    if (!hasShippingInfo) {
      return null;
    }

    return {
      Gstin: getValue(header['Shipping GSTIN']),
      LglNm: getValue(header['Shipping Legal Name']),
      TrdNm: getValue(header['Shipping Trade Name']),
      Addr1: getValue(header['Shipping Addr1']),
      Addr2: getValue(header['Shipping Addr2']),
      Loc: getValue(header['Shipping Location']),
      Pin: parseInteger(header['Shipping Pin Code']),
      Stcd: this.getStateCode(header['Shipping State'])
    };
  }
}

export default ConversionEngine;
