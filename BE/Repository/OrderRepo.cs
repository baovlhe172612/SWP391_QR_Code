﻿using BE.Dtos;
using BE.Models;
using Swp391.Dtos;
namespace BE.Repository
{
    public class OrderRepo
    {
        SwpfinalContext context = new SwpfinalContext();

        /// <summary>
        /// hàm trả về toàn bộ hóa đơn
        /// </summary>

        /// <returns>toàn bộ hóa đơn</returns>
        public List<Order> getAllOrder()
        {
            return context.Orders.ToList();
        }
        /// <summary>
        /// add order
        /// </summary>
        /// <returns> add order</returns>
        public void addOrder(Order order)
        {
            context.Orders.Add(order);
            context.SaveChanges();
        }
        /// <summary>
        /// update order
        /// </summary>
        public void updateOreder(Order order)
        {
            context.Orders.Update(order);
            context.SaveChanges();
        }

        public List<Order> getAllOrderByStoreId(int id)
        {
            try
            {
                var listOrder = context.Orders
                                .Where(o => o.StoreId == id)
                                .OrderByDescending(o => o.Date)
                                .ToList();

                // Kiểm tra nếu danh sách rỗng
                if (listOrder == null || listOrder.Count == 0)
                {
                    return new List<Order>();
                }

                return listOrder;
            }
            catch (Exception ex)
            {
                // Log exception if needed, for example:
                // Log.Error(ex, "An error occurred while fetching orders");
                throw new Exception("An error occurred while fetching orders", ex);

                return new List<Order>();
            }
        }

        public List<DailyRevenueDtos> GetDailyRevenue()
        {
            var revenueList = context.Orders
                                     .Where(o => o.Date.HasValue && o.StoreId != null)
                                     .Join(context.Stores,
                                           o => o.StoreId,
                                           s => s.StoreId,
                                           (o, s) => new
                                           {
                                               o.Date,
                                               o.StoreId,
                                               s.StoreName,
                                               o.Total
                                           })
                                     .GroupBy(os => new { Date = os.Date.Value.Date, os.StoreId, os.StoreName })
                                     .Select(g => new DailyRevenueDtos
                                     {
                                         Date = g.Key.Date,
                                         StoreID = g.Key.StoreId,
                                         StoreName = g.Key.StoreName,
                                         TotalRevenue = g.Sum(os => os.Total)
                                     })
                                     .OrderByDescending(dr => dr.Date)
                                     .ThenBy(dr => dr.StoreID)
                                     .ToList();

            return revenueList;
        }

        /// <summary>
        /// Gets month revenue.
        /// </summary>
        /// <returns>A list of daily revenues.</returns>
        public List<MonthlyRevenueDtos> GetMonthlyRevenue()
        {
            var revenueList = context.Orders
                .Where(o => o.Date.HasValue && o.StoreId != null)
                .GroupBy(o => new { Year = o.Date.Value.Year, Month = o.Date.Value.Month, o.StoreId, o.Store.StoreName })
                .OrderByDescending(g => g.Key.Year)
                .ThenByDescending(g => g.Key.Month)
                .ThenBy(g => g.Key.StoreId)
                .Select(g => new MonthlyRevenueDtos
                {
                    YearMonth = new DateTime(g.Key.Year, g.Key.Month, 1),
                    StoreID = g.Key.StoreId,
                    StoreName = g.Key.StoreName,
                    TotalRevenue = g.Sum(o => o.Total)
                })
                .ToList();

            return revenueList;
        }




        /// <summary>
        /// Gets daily revenue by storeId
        /// </summary>
        /// <returns>A list of daily revenues.</returns>
        public List<DailyRevenueDtos> GetDailyRevenueByStoreId(int storeId)
        {
            var revenueList = context.Orders
                                     .Where(o => o.Date.HasValue && o.StoreId == storeId) // Filter orders by Date and specific StoreID
                                     .GroupBy(o => new { Date = o.Date.Value.Date, StoreID = o.StoreId })
                                     .Select(g => new DailyRevenueDtos
                                     {
                                         Date = g.Key.Date,
                                         StoreID = g.Key.StoreID,
                                         TotalRevenue = g.Sum(o => o.Total)
                                     })
                                     .OrderByDescending(dr => dr.Date) // Order by date in descending order
                                     .ToList();

            return revenueList;
        }







    }
}
