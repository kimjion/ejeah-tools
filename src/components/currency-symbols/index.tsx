import { useState, useMemo } from 'react'
import { Icon } from '@iconify/react'

const CurrencySymbols = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // 货币数据 - 涵盖银行主要可查汇率的国家/地区
  const currencyData = [
    // 主要发达国家
    { country: '美国', symbol: '$', currency: '美元', code: 'USD', flag: 'united-states' },
    { country: '欧盟', symbol: '€', currency: '欧元', code: 'EUR', flag: 'european-union' },
    { country: '英国', symbol: '£', currency: '英镑', code: 'GBP', flag: 'united-kingdom' },
    { country: '日本', symbol: '¥', currency: '日元', code: 'JPY', flag: 'japan' },
    { country: '瑞士', symbol: 'CHF', currency: '瑞士法郎', code: 'CHF', flag: 'switzerland' },
    { country: '加拿大', symbol: 'C$', currency: '加拿大元', code: 'CAD', flag: 'canada' },
    { country: '澳大利亚', symbol: 'A$', currency: '澳大利亚元', code: 'AUD', flag: 'australia' },
    { country: '新西兰', symbol: 'NZ$', currency: '新西兰元', code: 'NZD', flag: 'new-zealand' },

    // 亚洲主要国家
    { country: '中国', symbol: '¥', currency: '人民币', code: 'CNY', flag: 'china' },
    { country: '韩国', symbol: '₩', currency: '韩元', code: 'KRW', flag: 'south-korea' },
    { country: '印度', symbol: '₹', currency: '印度卢比', code: 'INR', flag: 'india' },
    { country: '新加坡', symbol: 'S$', currency: '新加坡元', code: 'SGD', flag: 'singapore' },
    { country: '马来西亚', symbol: 'RM', currency: '马来西亚林吉特', code: 'MYR', flag: 'malaysia' },
    { country: '泰国', symbol: '฿', currency: '泰铢', code: 'THB', flag: 'thailand' },
    { country: '印度尼西亚', symbol: 'Rp', currency: '印尼盾', code: 'IDR', flag: 'indonesia' },
    { country: '菲律宾', symbol: '₱', currency: '菲律宾比索', code: 'PHP', flag: 'philippines' },
    { country: '越南', symbol: '₫', currency: '越南盾', code: 'VND', flag: 'vietnam' },
    { country: '巴基斯坦', symbol: '₨', currency: '巴基斯坦卢比', code: 'PKR', flag: 'pakistan' },
    { country: '孟加拉国', symbol: '৳', currency: '孟加拉塔卡', code: 'BDT', flag: 'bangladesh' },
    { country: '斯里兰卡', symbol: '₨', currency: '斯里兰卡卢比', code: 'LKR', flag: 'sri-lanka' },
    { country: '缅甸', symbol: 'K', currency: '缅甸元', code: 'MMK', flag: 'myanmar-burma' },
    { country: '柬埔寨', symbol: '៛', currency: '柬埔寨瑞尔', code: 'KHR', flag: 'cambodia' },
    { country: '老挝', symbol: '₭', currency: '老挝基普', code: 'LAK', flag: 'laos' },
    { country: '文莱', symbol: 'B$', currency: '文莱元', code: 'BND', flag: 'brunei' },
    { country: '蒙古', symbol: '₮', currency: '蒙古图格里克', code: 'MNT', flag: 'mongolia' },

    // 中东地区
    { country: '沙特阿拉伯', symbol: '﷼', currency: '沙特里亚尔', code: 'SAR', flag: 'saudi-arabia' },
    { country: '阿联酋', symbol: 'د.إ', currency: '阿联酋迪拉姆', code: 'AED', flag: 'united-arab-emirates' },
    { country: '科威特', symbol: 'د.ك', currency: '科威特第纳尔', code: 'KWD', flag: 'kuwait' },
    { country: '卡塔尔', symbol: 'ر.ق', currency: '卡塔尔里亚尔', code: 'QAR', flag: 'qatar' },
    { country: '巴林', symbol: '.د.ب', currency: '巴林第纳尔', code: 'BHD', flag: 'bahrain' },
    { country: '阿曼', symbol: 'ر.ع.', currency: '阿曼里亚尔', code: 'OMR', flag: 'oman' },
    { country: '约旦', symbol: 'د.ا', currency: '约旦第纳尔', code: 'JOD', flag: 'jordan' },
    { country: '黎巴嫩', symbol: '£', currency: '黎巴嫩镑', code: 'LBP', flag: 'lebanon' },
    { country: '叙利亚', symbol: '£', currency: '叙利亚镑', code: 'SYP', flag: 'syria' },
    { country: '伊拉克', symbol: 'ع.د', currency: '伊拉克第纳尔', code: 'IQD', flag: 'iraq' },
    { country: '伊朗', symbol: '﷼', currency: '伊朗里亚尔', code: 'IRR', flag: 'iran' },
    { country: '以色列', symbol: '₪', currency: '以色列新谢克尔', code: 'ILS', flag: 'israel' },
    { country: '土耳其', symbol: '₺', currency: '土耳其里拉', code: 'TRY', flag: 'turkey' },

    // 欧洲其他国家
    { country: '挪威', symbol: 'kr', currency: '挪威克朗', code: 'NOK', flag: 'norway' },
    { country: '瑞典', symbol: 'kr', currency: '瑞典克朗', code: 'SEK', flag: 'sweden' },
    { country: '丹麦', symbol: 'kr', currency: '丹麦克朗', code: 'DKK', flag: 'denmark' },
    { country: '冰岛', symbol: 'kr', currency: '冰岛克朗', code: 'ISK', flag: 'iceland' },
    { country: '波兰', symbol: 'zł', currency: '波兰兹罗提', code: 'PLN', flag: 'poland' },
    { country: '捷克', symbol: 'Kč', currency: '捷克克朗', code: 'CZK', flag: 'czechia' },
    { country: '匈牙利', symbol: 'Ft', currency: '匈牙利福林', code: 'HUF', flag: 'hungary' },
    { country: '罗马尼亚', symbol: 'lei', currency: '罗马尼亚列伊', code: 'RON', flag: 'romania' },
    { country: '保加利亚', symbol: 'лв', currency: '保加利亚列弗', code: 'BGN', flag: 'bulgaria' },
    { country: '克罗地亚', symbol: 'kn', currency: '克罗地亚库纳', code: 'HRK', flag: 'croatia' },
    { country: '塞尔维亚', symbol: 'RSD', currency: '塞尔维亚第纳尔', code: 'RSD', flag: 'serbia' },
    { country: '俄罗斯', symbol: '₽', currency: '俄罗斯卢布', code: 'RUB', flag: 'russia' },
    { country: '乌克兰', symbol: '₴', currency: '乌克兰格里夫纳', code: 'UAH', flag: 'ukraine' },
    { country: '白俄罗斯', symbol: 'Br', currency: '白俄罗斯卢布', code: 'BYN', flag: 'belarus' },

    // 高加索和中亚
    { country: '格鲁吉亚', symbol: '₾', currency: '格鲁吉亚拉里', code: 'GEL', flag: 'georgia' },
    { country: '亚美尼亚', symbol: '֏', currency: '亚美尼亚德拉姆', code: 'AMD', flag: 'armenia' },
    { country: '阿塞拜疆', symbol: '₼', currency: '阿塞拜疆马纳特', code: 'AZN', flag: 'azerbaijan' },
    { country: '哈萨克斯坦', symbol: '₸', currency: '哈萨克斯坦坚戈', code: 'KZT', flag: 'kazakhstan' },
    { country: '乌兹别克斯坦', symbol: "so'm", currency: '乌兹别克斯坦索姆', code: 'UZS', flag: 'uzbekistan' },
    { country: '塔吉克斯坦', symbol: 'SM', currency: '塔吉克斯坦索莫尼', code: 'TJS', flag: 'tajikistan' },
    { country: '吉尔吉斯斯坦', symbol: 'лв', currency: '吉尔吉斯斯坦索姆', code: 'KGS', flag: 'kyrgyzstan' },
    { country: '土库曼斯坦', symbol: 'T', currency: '土库曼斯坦马纳特', code: 'TMT', flag: 'turkmenistan' },

    // 南美洲
    { country: '巴西', symbol: 'R$', currency: '巴西雷亚尔', code: 'BRL', flag: 'brazil' },
    { country: '阿根廷', symbol: '$', currency: '阿根廷比索', code: 'ARS', flag: 'argentina' },
    { country: '智利', symbol: '$', currency: '智利比索', code: 'CLP', flag: 'chile' },
    { country: '秘鲁', symbol: 'S/', currency: '秘鲁索尔', code: 'PEN', flag: 'peru' },
    { country: '哥伦比亚', symbol: '$', currency: '哥伦比亚比索', code: 'COP', flag: 'colombia' },
    { country: '委内瑞拉', symbol: 'Bs', currency: '委内瑞拉玻利瓦尔', code: 'VES', flag: 'venezuela' },
    { country: '厄瓜多尔', symbol: '$', currency: '美元', code: 'USD', flag: 'ecuador' },
    { country: '乌拉圭', symbol: '$U', currency: '乌拉圭比索', code: 'UYU', flag: 'uruguay' },
    { country: '巴拉圭', symbol: 'Gs', currency: '巴拉圭瓜拉尼', code: 'PYG', flag: 'paraguay' },
    { country: '玻利维亚', symbol: '$b', currency: '玻利维亚诺', code: 'BOB', flag: 'bolivia' },
    { country: '圭亚那', symbol: 'G$', currency: '圭亚那元', code: 'GYD', flag: 'guyana' },
    { country: '苏里南', symbol: 'Sr$', currency: '苏里南元', code: 'SRD', flag: 'suriname' },

    // 北美洲
    { country: '墨西哥', symbol: '$', currency: '墨西哥比索', code: 'MXN', flag: 'mexico' },
    { country: '危地马拉', symbol: 'Q', currency: '危地马拉格查尔', code: 'GTQ', flag: 'guatemala' },
    { country: '洪都拉斯', symbol: 'L', currency: '洪都拉斯伦皮拉', code: 'HNL', flag: 'honduras' },
    { country: '尼加拉瓜', symbol: 'C$', currency: '尼加拉瓜科多巴', code: 'NIO', flag: 'nicaragua' },
    { country: '哥斯达黎加', symbol: '₡', currency: '哥斯达黎加科朗', code: 'CRC', flag: 'costa-rica' },
    { country: '巴拿马', symbol: 'B/.', currency: '巴拿马巴波亚', code: 'PAB', flag: 'panama' },

    // 非洲
    { country: '南非', symbol: 'R', currency: '南非兰特', code: 'ZAR', flag: 'south-africa' },
    { country: '埃及', symbol: '£', currency: '埃及镑', code: 'EGP', flag: 'egypt' },
    { country: '尼日利亚', symbol: '₦', currency: '尼日利亚奈拉', code: 'NGN', flag: 'nigeria' },
    { country: '肯尼亚', symbol: 'KSh', currency: '肯尼亚先令', code: 'KES', flag: 'kenya' },
    { country: '坦桑尼亚', symbol: 'TSh', currency: '坦桑尼亚先令', code: 'TZS', flag: 'tanzania' },
    { country: '乌干达', symbol: 'USh', currency: '乌干达先令', code: 'UGX', flag: 'uganda' },
    { country: '埃塞俄比亚', symbol: 'Br', currency: '埃塞俄比亚比尔', code: 'ETB', flag: 'ethiopia' },
    { country: '加纳', symbol: '₵', currency: '加纳塞地', code: 'GHS', flag: 'ghana' },
    { country: '摩洛哥', symbol: 'د.م.', currency: '摩洛哥迪拉姆', code: 'MAD', flag: 'morocco' },
    { country: '阿尔及利亚', symbol: 'د.ج', currency: '阿尔及利亚第纳尔', code: 'DZD', flag: 'algeria' },
    { country: '突尼斯', symbol: 'د.ت', currency: '突尼斯第纳尔', code: 'TND', flag: 'tunisia' },
    { country: '利比亚', symbol: 'ل.د', currency: '利比亚第纳尔', code: 'LYD', flag: 'libya' },
    { country: '苏丹', symbol: 'ج.س.', currency: '苏丹镑', code: 'SDG', flag: 'sudan' },
    { country: '博茨瓦纳', symbol: 'P', currency: '博茨瓦纳普拉', code: 'BWP', flag: 'botswana' },
    { country: '纳米比亚', symbol: 'N$', currency: '纳米比亚元', code: 'NAD', flag: 'namibia' },
    { country: '津巴布韦', symbol: 'Z$', currency: '津巴布韦元', code: 'ZWL', flag: 'zimbabwe' },
    { country: '赞比亚', symbol: 'ZK', currency: '赞比亚克瓦查', code: 'ZMW', flag: 'zambia' },
    { country: '马拉维', symbol: 'MK', currency: '马拉维克瓦查', code: 'MWK', flag: 'malawi' },
    { country: '莫桑比克', symbol: 'MT', currency: '莫桑比克梅蒂卡尔', code: 'MZN', flag: 'mozambique' },
    { country: '马达加斯加', symbol: 'Ar', currency: '马达加斯加阿里亚里', code: 'MGA', flag: 'madagascar' },
    { country: '毛里求斯', symbol: '₨', currency: '毛里求斯卢比', code: 'MUR', flag: 'mauritius' },
    { country: '塞舌尔', symbol: '₨', currency: '塞舌尔卢比', code: 'SCR', flag: 'seychelles' },

    // 大洋洲
    { country: '斐济', symbol: 'FJ$', currency: '斐济元', code: 'FJD', flag: 'fiji' },
    { country: '巴布亚新几内亚', symbol: 'K', currency: '巴布亚新几内亚基那', code: 'PGK', flag: 'papua-new-guinea' },
    { country: '瓦努阿图', symbol: 'Vt', currency: '瓦努阿图瓦图', code: 'VUV', flag: 'vanuatu' },
    { country: '萨摩亚', symbol: 'T', currency: '萨摩亚塔拉', code: 'WST', flag: 'samoa' },
    { country: '汤加', symbol: 'T$', currency: '汤加潘加', code: 'TOP', flag: 'tonga' },

    // 特别行政区和地区
    { country: '香港', symbol: 'HK$', currency: '港币', code: 'HKD', flag: 'hong-kong-sar-china' },
    { country: '台湾', symbol: 'NT$', currency: '新台币', code: 'TWD', flag: 'taiwan' },
    { country: '澳门', symbol: 'MOP$', currency: '澳门币', code: 'MOP', flag: 'macao-sar-china' }
  ]

  // 搜索过滤
  const filteredData = useMemo(() => {
    if (!searchTerm) return currencyData
    
    return currencyData.filter(item =>
      item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.includes(searchTerm)
    )
  }, [searchTerm])


  return (
    <div className='max-w-6xl mx-auto font-sans'>
      <div className='bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden'>
        {/* 搜索栏 */}
        <div className='p-6 border-b border-gray-200 bg-gray-50'>
          <div className='max-w-md'>
            <label htmlFor='search' className='block text-sm font-medium text-gray-700 mb-2'>
              搜索国家、货币或符号
            </label>
            <input
              id='search'
              type='text'
              placeholder='输入国家名、货币名或符号...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
            />
          </div>
          <p className='text-sm text-gray-500 mt-2'>
            共找到 {filteredData.length} 种货币
          </p>
        </div>

        {/* 表格 */}
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-gray-50 border-b border-gray-200'>
                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  国家/地区
                </th>
                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  国旗
                </th>
                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  货币符号
                </th>
                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  货币名称
                </th>
                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  货币代码
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredData.map((item, index) => (
                <tr key={index} className='hover:bg-gray-50 transition-colors duration-150'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {item.country}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {item.flag ? (
                      <Icon 
                        icon={`twemoji:flag-${item.flag}`} 
                        width="24" 
                        height="24" 
                        className="inline-block"
                      />
                    ) : (
                      <div className="w-6 h-6"></div>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-2xl font-bold text-blue-600 font-mono'>
                      {item.symbol}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {item.currency}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono'>
                      {item.code}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className='text-center py-12'>
              <div className='text-gray-500'>
                <svg className='mx-auto h-12 w-12 text-gray-400 mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.58-6.322 1.572M5.036 10.5c-.328-.5-.328-1 0-1.5.328-.5.328-1 0-1.5M18.964 10.5c.328-.5.328-1 0-1.5.328-.5.328-1 0-1.5' />
                </svg>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>未找到匹配结果</h3>
                <p className='text-gray-500'>尝试修改搜索条件或清空搜索框查看全部货币</p>
              </div>
            </div>
          )}
        </div>
        
        {/* 底部统计信息 */}
        <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
          <p className='text-sm text-gray-600'>
            数据包含 {currencyData.length} 个国家和地区的货币信息
          </p>
        </div>
      </div>
    </div>
  )
}

export default CurrencySymbols
