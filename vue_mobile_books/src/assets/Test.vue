<template>
  <div>
    <p>{{ num }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 0,
      burry: [
        {
          name: "aaaa",
          age: 12,
          children: [
            { name: "asasd", age: 142, children: [] },
            { name: "adasdffaaa", age: 555, children: [] },
            { name: "aaffasdaa", age: 65, children: [] },
          ],
        },
        {
          name: "aaaa",
          age: 3,
          children: [
            { name: "aaadasfa", age: 6, children: [] },
            { name: "aaafgghha", age: 64, children: [] },
            {
              name: "ajhgjaaa",
              age: 12,
              children: [
                {
                  name: "aalhaa",
                  age: 12,
                  children: [
                    { name: "aaaqwea", age: 15, children: [] },
                    { name: "aasraaaa", age: 44, children: [] },
                    { name: "aaascaa", age: 152, children: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.burrynum();
  },
  methods: {
    burrynum() {
      this.burry.forEach((a) => {
        this.num = this.num + 1;
        //console.log(this.num);
        //console.log(a);
        a.children.forEach((b) => {
          this.num = this.num + 1;
          //console.log(this.num);
          //console.log(b);
          b.children.forEach((c) => {
            this.num = this.num + 1;
            console.log(this.num);
            console.log(c);
            c.children.forEach((d) => {
              this.num = this.num + 1;
              console.log(this.num);
              console.log(d);
            });
          });
        });
      });
    },
  },
};
</script>

<style></style>
