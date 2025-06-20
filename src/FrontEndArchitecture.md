

# Intro & The big picture
## Intro 
For the developers who never use React to build any apps or but want to learn about it with a practical insight, this doc might be a good help for you. There is not only a introduction for the app but also some detailed technical scripts in the Components section.
##The big picture



# Components Intro
An Object in Siren is a self-contained module. It must define all of its
dependencies, and all of its behaviours. Since objects are such
monolithic things, we can divide it up in simpler concepts, however. So,
for Siren, an object is made out of:

- **Configuration**, which are the **only** parameters which modify the
  behaviour of the object. Additional configuration may be provided for
  each message in form of arguments, of course.

- **Meta-data**, which are pieces of information associated with an
  object, but which have no bearing on the actual behaviour of the
  object. Also because of this updating meta-data in Siren is considered
  a benign non-observable effect.

- **Behaviour**, which are operations that can be performed by an
  object, taking into account its current configuration.

- **Refinement**, which are operations that can refine an object (by
  modifying its behaviour or configuration). A refinement always gives
  you a new object which is a **strict superset** (It *must* adhere to
  Liskov's Substitution Principle  — bar Reflection) of the original
  object.

Given this, we can categorise objects in two groups:

- **Examples**, which are complete objects you can interact with right
  away, but *might* not have a very interesting behaviour before you
  refine them further.

- **Mixins**, which are incomplete objects meant to be either refined or
  incorporated into another object. Interacting with a mixin directly
  for purposes outside of refinement is considered an error.


## Fork & Configuration



From there, people can refine the browser, either by cloning the object
and modifying its configuration behaviours directly, or by sending the
`object:` and `context:` messages to it. Note that, in order to maintain
the other pieces of configuration, and added behaviours, a refinement
message always clones the target object, which in the case of `browse
object: Mirror` would be the object pointed by `browse`.

In the Browser, the `display` configuration determines how text will be
formatted in the display. It has things like "how to render markdown",
"how to render headings", etc. If one wanted to change these, they could
simply refine the display:

```ruby
let display = browse display.
let my-browse = browse {
  def self display = display {
    def _ heading!: text
      Console write-line!: "# ", text, "\n".
  }
}
```

Then using `my-browse` would display headings with a `#` preceded to the
text, rather than a border beneath the text, which is what the default
display object does.

The Browsing library also allows one to browse messages. Messages are
formatted in a different way than regular objects, so the library
separates this in a `Message-Browser` object. However, there's no way of
providing a default behaviour to this object, the user really needs to
configure it before they interact with it at all. To accommodate this,
the `Browser` object only allows creating *configured* `Message-Browser`
objects, by requiring one to send a `message:` message before they can
get a `Message-Browser`.


## Incomplete objects

Incomplete objects should describe their entire expected interface. The
`required` decorator is used to describe expectations, and the
documentation should give people enough information so they can
implement the required behaviours. E.g.:

```ruby
let Sum = {
  @required
  def self from: initial fold-with: reducer
    # Computes a single value by applying a binary message to the
    # values of this object and an accumulator.
    #
    # `from:fold-with:` is a structural transformation that allows
    # one to compute a value out of all of the contents of a
    # compound object.
    #
    # E.g.:
    #
    #     [1. 2. 3] from: 0 fold-with: _ + _ ===> (((0 + 1) + 2) + 3)
    unimplemented

  def self sum
    self from: 0 fold-with: _ + _
}
```


## Naming conventions

Siren uses a handful of naming conventions. And the approach outlined
above adds a few more. So, below is a complete list of conventions:

- `predicate?`, when a message tests something and returns either `True`
  or `False`, it gets suffixed with a question mark (`?`). Keyword
  messages will look like `foo:bar:baz?:`, binary messages don't follow
  this rule.

- `action!`, when a message results in an semantically observable,
  non-benign side-effect, it gets suffixed with an exclamation mark
  (`!`). Keyword messages will look like `foo:bar:baz!:`, binary
  messages don't follow this rule.

- `as-type`, when a message allows one to convert the object to another
  type.

- `Some-Object-Name`, local objects are always defined in proper
  case. Objects that are not meant to be used directly (they only serve
  as a namespace, or they need to be refined first) also get named in
  proper-case in messages.

- `some-object-name`, objects that are useful out of the box get named
  in all lower case.

- `Mixins Some-Object-Name`, objects that are strictly meant to be mixed
  into another object (through the `mixin:` decorator) should be added
  to a `mixins` namespace in the module.


## Common categories

A few standard categories to use when describing your objects:

- **Configuration**, the message provides an object that changes the
  behaviour of the rest of the object.

- **Refining**, the message constructs a new object with a different
  piece of configuration.

- **Constructing**, the message constructs a new object *of a different
  type*.

- **Inspecting**, the message is meant for debugging.

- **Comparing and testing**, this message allows one to compare the
  object with a similar object, or test some internal property of the
  object.

- **Extracting information**, for a compound object, this message allows
  one to access a particular portion of the data.

- **Converting to other types**, this message allows one to convert an object from one
  type to another (like Text → Integer).

- **Transforming**, this message allows one to apply some kind of
  transformation to the data this object represents.

- **Combining**, this message allows one to combine objects of the same
  type.

- **Handling errors**, this message allows one to handle errors that may
  be represented by/stored in the object.

- **Auxiliary operations**, this message should not be in this object,
  but it's here anyway playing a supporting role. This indicates either
  a miscategorisation or bad organisation, in general.

- **Decorators**, this message is specifically meant to be used as a
  decorator.

- **Mixins**, this message provides a mixin.


## How to write documentation

Your documentation should look something like:

```text
[short descriptive summary of what the object/message does]

## Why?

[detailed description of WHY the object exists. This should provide
 compelling arguments on why someone might use the object.]

## Drawbacks

[if applicable, provide a description of the problems people might
 run into by using this object, because of some design trade-off
 you made (maybe your API is easy to use and consistent, but not
 very efficient? Detail that here)]

## Architecture

[For objects/modules, describe the general architecture, so people
 know how each piece fits together, and can better reason about
 its behaviour/contribute]
```

Where possible, examples of how to use an object/message should
be provided. Examples are great for people to start playing around
with an object, and they double as test cases in Siren.

Always provide the common meta-data for objects:

- Stability
- Authors
- Licence
- Platforms
- Portability
- Category
- Tags (where applicable)

For any non-trivial (constant-time) behaviour, a `complexity` meta-data
should be attached, describing the algorithmic complexity of the
behaviour in Big O notation. Where relevant, also provide complexity for
behaviours that run in constant-time (like `count` in objects, which
is generally linear).

See the
[Origami Tower conventions documentation](https://github.com/origamitower/conventions/blob/master/general/how-do-i-open-source-a-new-project.md)
for more details on all of this.


<!--
Local Variables:
ispell-local-dictionary: "british"
fill-column: 72
End:
-->
