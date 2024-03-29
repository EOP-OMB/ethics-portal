﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.Ethics.Application.Dtos
{
    public class EventsRequestChart
    {
        public List<string> Labels { get; set; }
        public List<DataSet> Datasets { get; set; }
    }

    public class DataSet
    {
        public string Label { get; set; }
        public List<int> Data { get; set; }
        public string BackgroundColor { get; set; }
        public string BorderColor { get; set; }
        public bool Fill { get; set; }
    }
}
